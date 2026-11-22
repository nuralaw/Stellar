# ТЗ: живой подбор соперника (ELO, ревизия 2)

Статус: 2026-11-22 — этапы L1 (база, хранилище) и L2 (сервер, API) готовы и прошли ревью, L3 (интерфейс) в работе. Отличия реализации от текста — раздел 11. Дополняет `docs/ELO.md` и **заменяет** в нём асинхронную схему: раздел 5 целиком, часть 2 (п. 3), 6.3 (брошенный матч), 8.2–8.5 (в части статусов, подбора и API), 9.5, решения 1, 7, 9 раздела 11. Всё остальное (очки 3, ELO 4, уровни, античит 6.1–6.2, 6.4–6.5, доски 7) остаётся как есть.

Как работать: как в `docs/ELO.md` §0 (план → `coder` → `reviewer`), этапы — раздел 9 этого файла. Все числа — в `src/lib/elo-config.ts`.

**Уже сделано (не закоммичено):** старт рейтинга 100 вместо 1000 (конфиг, SQL, тесты, админка, `docs/ELO.md`). Начаты типы ревизии 2: `src/lib/elo-api-types.ts` (`RankedStatus`, `MatchSummary`, `RankedHub`, `QueueState`, код `in_match`) и `src/components/ranked/api.ts` (`rankedDelete`, `fmtClock`; удалены `fmtLeft`, `GO_KEY`). Из-за этого сейчас не собираются `elo-server.ts` и компоненты ranked — это и чинят этапы ниже.

---

## 1. Как это выглядит для ученика

1. `/ranked` → **Play ranked** → окно с правилами → **Find an opponent**. Встаёт в очередь (полноэкранный режим на этом шаге **не** включается).
2. Экран поиска (на той же странице, вместо карточки Play): `Searching… 0:37`, окно `±200 ELO` (позже `Any rating`), `3 players searching`, кнопка **Cancel**. Страница опрашивает сервер раз в 2 с.
3. Нашёлся соперник → переход на `/ranked/[id]`: карточка соперника, обратный отсчёт `Start within 1:24`, кнопка **Start in full screen** (это и есть жест пользователя для полноэкранного режима).
4. Оба играют **одни и те же 10 вопросов одновременно, каждый в своём темпе** (таймеры и очки — как раньше, `docs/ELO.md` 3 и 6.1). Не синхронно по вопросам: никто никого не ждёт.
5. Закончил первым → экран `Your opponent is still playing…` (опрос раз в 3 с). Когда закончил и соперник → итог: победа/поражение/ничья, ±ELO, разбор.
6. За 5 минут никого не нашли → `No opponent found` + **Search again**. Ничего не создаётся, рейтинг не меняется.

---

## 2. Очередь

### 2.1 Числа (в `elo-config.ts`)

```ts
/** Matchmaking queue (ELO-live 2). */
export const QUEUE = {
  pollMs: 2000,        // клиент опрашивает очередь так часто
  dropAfterS: 15,      // нет опроса столько секунд → игрок выпадает из очереди
  searchMaxS: 300,     // поиск сам заканчивается через 5 минут ("timeout")
} as const;
/** Окно рейтинга: base + step × floor(секунд в поиске / everyS); с openAfterS — без ограничения. */
export const QUEUE_WINDOW = { base: 100, step: 100, everyS: 30, openAfterS: 120 } as const;
/** После подбора у каждого игрока столько секунд, чтобы открыть первый вопрос. */
export const START_DEADLINE_S = 90;
/** Начатая часть без признаков жизни столько секунд = сдача (вместо STALE_PART_MS = 30 мин). */
export const ABANDON_AFTER_S = 120;
```

Удалить: `MATCH_WINDOW`, `WAITING_EXPIRY_H`, `MAX_WAITING_MATCHES`. Оставить: `REMATCH_COOLDOWN_H` (24), `MAX_MATCHES_PER_DAY` (30), `RECENT_QUESTIONS_DAYS`.

Окно по времени поиска: 0–29 с → ±100, 30–59 с → ±200, 60–89 с → ±300, 90–119 с → ±400, с 120 с → любой рейтинг. Чистая функция `queueWindow(searchedMs): number | null` (`null` = без ограничения) — в `src/lib/elo.ts`, с тестом.

### 2.2 Правила

- **Войти в очередь** может вошедший с подтверждённым email и публичным именем (как раньше для `/play`), если у него нет матча в статусе `playing` (иначе 409 `in_match`) и он не исчерпал 30 матчей за 24 ч (429 `limit_daily`). Повторный вход, пока поиск идёт, только обновляет «признак жизни» (время начала поиска не сбрасывается).
- **Набор вопросов готовится при входе в очередь** — по рейтингу этого игрока и без его вопросов за 30 дней (`buildQuestionSet`, как сейчас) — и хранится в строке очереди.
- **Пара подходит**, если: тот же режим; не я; соперник ищет (не `timeout`, опрос был не позже 15 с назад); ни у кого нет матча `playing`; эта пара не играла матч (кроме `void`) за последние 24 ч; `|R₁ − R₂| ≤ max(окно₁, окно₂)` (окно того, кто ищет дольше, расширяет поиск обоим; `null` = любое).
- Из подходящих берётся тот, кто ищет **дольше всех** (`since` по возрастанию, при равенстве — меньший `user_id`).
- **Игрок A** = тот из двоих, кто встал в очередь раньше. Матч берёт **его** набор вопросов (он — бывший «создатель матча» из `docs/ELO.md` 5.2).
- Подбор делается при каждом опросе и при входе. Все операции с очередью сериализуются одной транзакционной блокировкой (`pg_advisory_xact_lock(hashtext('elo_queue'))`) — два одновременных опроса не создадут два матча.
- **Состояния строки очереди:** `searching` → `matched` (матч создан) или `timeout` (5 минут). `timeout` отдаётся клиенту **один раз**, после чего строка удаляется (дальше — `idle`). `matched` живёт, пока матч в `playing` (перезагрузка вернёт в матч), затем при чтении удаляется.
- **Отмена** (`DELETE`) удаляет строку `searching`/`timeout`. Если пара уже собрана — отмена не действует, ответ `matched`.
- Уход со страницы поиска: клиент шлёт `DELETE` с `keepalive: true`; если не дошёл — выпадение через 15 с без опроса.

---

## 3. Матч

### 3.1 Статусы

```
playing → finished
   └────→ void   (никто не начал вовремя / админ)
```

- `playing` — создан при подборе; у каждой стороны своя часть (10 вопросов). Пока хотя бы одна часть не закрыта.
- `finished` — обе части закрыты (сыграны или сданы) → `elo_finish_match` (как раньше, атомарно, идемпотентно).
- `void` — рейтинг не меняется (или откатывается админом, как сейчас).

`playing_a`, `waiting`, `playing_b`, `expired` удаляются отовсюду.

### 3.2 Старт части

- Часть начинается первым `next` (открытие вопроса 0); сервер пишет `a_started_at` / `b_started_at`.
- Срок старта: `start_by = created_at + 90 с`. Если он прошёл:
  - не начал **никто** → матч `void`;
  - не начал **один** → его часть сдаётся (`forfeitPart`: все 10 вопросов `annulled`, `forfeit` = его сторона) — поражение. Это и защита от «увидел рейтинг соперника и не стал играть».

### 3.3 Ход и завершение

- Вопросы, таймеры, `next`/`answer`/`annul`/`leave`, полноэкранный режим и правило 15 с — **без изменений** (`docs/ELO.md` 6.1–6.3).
- Часть закрыта (последний вопрос отвечен/просрочен/аннулирован) → сервер пишет очки этой стороны (`points_a`/`points_b`) и `a_finished_at`/`b_finished_at`. Статус остаётся `playing`, пока не закрыта вторая часть; тогда — `finishMatch`.
- **Сдача** (`leave` или отсутствие > 15 с): часть сдавшегося закрывается как сейчас (`forfeitPart`), соперник **доигрывает свою часть** (его очки идут в недельную доску), итог — поражение сдавшегося — применяется, когда соперник закончит. Первая сдача остаётся в силе (как сейчас).
- **Брошенная часть** (вместо 30 мин): начатая, не закрытая часть, где с последнего признака жизни прошло > 120 с → `forfeitPart`. Признак жизни = `max(начало части, время последнего ответа, issued_at + лимит открытого вопроса)` (как сейчас в `resolveStale`).
- Всё это — **лениво**, функцией `resolveMatch(m, now)` для **обеих** сторон: при `GET /api/ranked`, `GET /api/ranked/[id]`, `next`, входе и опросе очереди. Cron не нужен. Тот, кто ждёт итог, опрашивает матч раз в 3 с — этого хватает, чтобы брошенный матч завершился сам.

### 3.4 Что видит игрок до конца матча

- Очки соперника и его сдача — скрыты до `finished` (как сейчас).
- `opponentDone` — закрыта ли часть соперника (без очков).
- **Разбор (ответы и объяснения) — только когда матч не `playing`** (было: после своей части). Иначе закончивший первым может подсказать ответы сопернику, который играет тот же набор прямо сейчас.

---

## 4. Данные

### 4.1 SQL (`supabase/elo.sql` + тот же блок в `supabase/setup.sql`; безопасный перезапуск)

**Новая таблица:**

```sql
create table if not exists public.elo_queue (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  mode         text not null default 'mixed' check (mode in ('mixed', 'rw', 'math')),
  rating       int  not null,
  question_ids text[] not null check (cardinality(question_ids) = 10),
  since        timestamptz not null,
  last_seen    timestamptz not null,
  status       text not null check (status in ('searching', 'matched', 'timeout')),
  match_id     uuid references public.elo_matches (id) on delete set null
);
create index if not exists elo_queue_searching on public.elo_queue (mode, since) where status = 'searching';
alter table public.elo_queue enable row level security;  -- политик нет, только service_role
```

**`elo_matches`:**
- добавить `a_started_at timestamptz`, `b_finished_at timestamptz`, `start_by timestamptz` (`add column if not exists`);
- удалить `expires_at`, индексы `elo_matches_waiting`, `elo_matches_one_playing_a`, `elo_matches_a_finished` (`drop … if exists`);
- новые частичные уникальные индексы: один `playing` на игрока как A и как B (`… (player_a) where status = 'playing'`, то же для `player_b`);
- **миграция статусов** (перед заменой check): `update … set status = 'void' where status in ('playing_a', 'waiting', 'playing_b', 'expired')` — рейтинг у них не применялся, менять нечего. Потом check: `status in ('playing', 'finished', 'void')`.

**Функции** (все: `security definer`, `set search_path = ''`, `execute` только `service_role`, глобальная `pg_advisory_xact_lock(hashtext('elo_queue'))`). Числа правил приходят параметром `p_rules jsonb` из `elo-config.ts` (`{base, step, every_s, open_after_s, drop_after_s, search_max_s, start_deadline_s, rematch_h}`) — в SQL не хардкодить.
- `elo_queue_join(p_user, p_mode, p_rating, p_question_ids, p_now, p_rules) → jsonb` — проверка активного матча (`raise 'ELO_ACTIVE_MATCH'`), upsert строки (2.2), затем та же попытка подбора, что в `poll`.
- `elo_queue_poll(p_user, p_now, p_rules) → jsonb` — уборка (`searching` без опроса 15 с → удалить; `searching` дольше 5 мин → `timeout`), обновить `last_seen`, попытка подбора (2.2): `insert` матча (`status 'playing'`, A/B, набор A, `created_at = p_now`, `start_by = p_now + 90 с`), обеим строкам `matched` + `match_id`. Отдать `timeout` один раз; `matched` с матчем не в `playing` → удалить.
- `elo_queue_cancel(p_user, p_now) → jsonb`.
- Ответ всех трёх: `{status: 'idle'|'searching'|'matched'|'timeout', since, match_id, searching}` (`searching` = сколько других ищут в этом режиме сейчас). Окно и `until` считает TS.
- `elo_finish_match`: идемпотентность по `status <> 'playing'`; требует обе `points_*`.
- `elo_void_match`: без изменений по смыслу (`playing` просто становится `void`).
- `elo_claim_waiting` — **удалить** (`drop function if exists`, вместе с grant/revoke).
- `elo_leaderboard`, доска недели: только `status = 'finished'`, обе стороны по `finished_at` в неделе (ветку «A по `a_finished_at`» убрать).
- `supabase/elo-check.sql`: заменить проверки `elo_claim_waiting` сквозным прогоном очереди: два игрока → `join` + `poll` → один матч, A = раньше вставший; повторный `poll` второго → тот же `match_id`.

### 4.2 Хранилище (`src/lib/elo-store.ts`, обе реализации — Supabase и `.data/elo.json`)

- `MatchStatus = "playing" | "finished" | "void"`. `EloMatch`: + `aStartedAt`, `bFinishedAt`, `startBy`; − `expiresAt`.
- Удалить: `createMatch`, `claimWaiting`, `countWaiting`, `expireStale`, `EloLimitError.kind "waiting"`.
- Добавить: `queueJoin({ userId, mode, rating, questionIds, now })`, `queuePoll({ userId, now })`, `queueCancel({ userId, now })` → `QueueRecord { status, since, matchId, searching }`. Правила очереди (`QUEUE`, `QUEUE_WINDOW`, `START_DEADLINE_S`, `REMATCH_COOLDOWN_H`) берутся из конфига, в Supabase — передаются `p_rules`.
- `MatchPatch`: `aStartedAt`, `bStartedAt`, `aFinishedAt`, `bFinishedAt`, `pointsA`, `pointsB`, `forfeit`; статус меняют только `finishMatch` / `voidMatch`.
- `listMatches` → `{ active: EloMatch | null (status playing, я A или B), recent: EloMatch[] (finished / void, 10) }`.
- `countStarted` — матчи, где я A или B, по `created_at`.
- Локальное хранилище повторяет SQL по смыслу (один процесс — синхронный участок = атомарность).

---

## 5. Сервер и API

### 5.1 `src/lib/elo-server.ts`

- `queueJoin(userId, { mode, name, avatar }, now)` — имя/аватар в `ensurePlayer` (как сейчас в `play`), лимит суток, набор вопросов, `store.queueJoin`. Перед проверкой `in_match` — `resolveMatch` активного матча (брошенный не должен блокировать очередь).
- `queuePoll(userId, now)`, `queueCancel(userId, now)` → `QueueState` (окно: `queueWindow(now − since)`; `until = since + 5 мин`; `opponent` при `matched`; `serverNow`).
- `resolveMatch(m, now)` вместо `resolveStale`: срок старта (3.2), брошенные части обеих сторон (3.3), «обе части закрыты → `finishMatch`» (самовосстановление).
- `settle`: часть закрыта → очки и `*FinishedAt` своей стороны; если вторая уже закрыта — `finishMatch`.
- `next`: при первом вопросе — `*StartedAt`.
- `state`: `review` только если матч не `playing`; новые поля `MatchSummary` (`myPartDone`, `opponentDone`, `startBy`), плюс `serverNow` в `MatchState` (для отсчёта старта).
- `hub`: `active`, `recent`, `queue` (тем же `queuePoll`: чтение хаба тоже признак жизни и может собрать пару — это нормально), `limits.dailyLeft`.
- `play` — удалить.

### 5.2 Роуты

| Метод и путь | Тело | Ответ |
|---|---|---|
| `POST /api/ranked/queue` | `{ mode: "mixed", name, avatar }` | `QueueState` |
| `GET /api/ranked/queue` | — | `QueueState` (опрос + признак жизни) |
| `DELETE /api/ranked/queue` | — | `QueueState` |
| `GET /api/ranked` | — | `RankedHub` (с `queue`) |
| `GET /api/ranked/[id]` | — | `MatchState` (+ `serverNow`) |

`next`, `answer`, `annul`, `leave`, `img`, `/api/leaderboard` — без изменений. `src/app/api/ranked/play/route.ts` — удалить. Ошибки: 409 `in_match` (уже в матче — UI открывает его), 429 `limit_daily`, остальные как раньше.

В `elo-api-types.ts` поправить ссылки в комментариях на `docs/ELO-live.md`; `QueueState.window`: `null` = поиск не идёт **или** ограничения уже нет.

---

## 6. Интерфейс (`src/components/ranked/*`, тексты на английском, как весь сайт)

- **`useStartRanked`**: правила → `POST /api/ranked/queue` → состояние поиска. Полноэкранный режим здесь не запрашивать. Кнопка в диалоге: `Find an opponent`.
- **`RankedHub`**: панель поиска (2.1–2.2): `Searching… m:ss` (`fmtClock`), `±N ELO` / `Any rating`, `N players searching`, `Cancel`; опрос каждые `QUEUE.pollMs`, пока панель открыта; `matched` → `router.push('/ranked/[id]')`, а если вкладка скрыта — ещё и `document.title = "Opponent found!"`; `timeout` → `No opponent found in 5 minutes.` + `Search again`. Перезагрузка во время поиска (`hub.queue.status === "searching"`) продолжает поиск. Уход со страницы → `DELETE` с `keepalive`. `active` → карточка `Back to your match`. Блок «Waiting for an opponent» и все тексты про 48 часов — удалить.
- **`MatchPage`**: «ready» — карточка соперника, отсчёт до `startBy` (по `serverNow`, не по часам устройства), `Start in full screen`; по истечении — перечитать состояние (там уже итог). Убрать `GO_KEY` и `You play first…`. `playable` = `status === "playing" && !myPartDone`.
- **`MatchRunner`**: убрать `GO_KEY`; остальное без изменений.
- **`MatchResult`**: `playing` + `myPartDone` → `Your opponent is still playing…` (опрос раз в 3 с, пока вкладка видна); `void` → `Match didn't happen` / `Nobody started in time. No rating change.` (или админский текст, как сейчас). Разбор — только когда пришёл (`review !== null`). Удалить ветки `waiting` / `playing_b` / `expired`.
- **`ErrorPanel`**: `limit_waiting` → `in_match` (`You're already in a match.` + ссылка на него через хаб).
- **`Rules`** и список правил в хабе: «same 10 questions, at the same time, each at your own pace», 90 секунд на старт, сдача/уход = поражение; про 48 часов — убрать.

---

## 7. Админка, флаги, доски

- `elo-admin-data.ts`: `MATCH_STATUSES = ["playing", "finished", "void"]`; пара для флага 6.4 датируется `created_at` (момент подбора): `pairTime` → `createdAt`, запросы по `b_started_at` → по `created_at`.
- `RankedTab.tsx`: фильтр статусов из `MATCH_STATUSES`; в карточке матча показать `a_started_at` / `b_started_at` / `start_by`.
- Доски: недельная — см. 4.1; глобальная и сезонная не меняются.

---

## 8. Тесты (обязательны)

1. `elo.test.ts`: `queueWindow` — 0 с → 100, 29 с → 100, 30 с → 200, 119 с → 400, 120 с → `null`.
2. `elo-store.test.ts` (локальное хранилище):
   - два игрока в очереди → один матч `playing`, A = кто встал раньше, набор A;
   - окно: 100 и 450 не сводятся на 0 с, сводятся, когда дольше ищущий набрал ±400; с 120 с — любые;
   - без опроса 15 с → выпал; 5 мин → `timeout` один раз, затем `idle`;
   - `in_match` при входе с активным матчем; лимит 30/сутки; пара не сводится второй раз за 24 ч (`void` не считается);
   - отмена после подбора → `matched`; два «одновременных» опроса → один матч;
   - `finishMatch` только при обеих частях; повтор — без изменений.
3. `elo-server.test.ts` (сквозные):
   - оба играют параллельно (вопросы чередуются A/B) → `finished`, Δ как в кейсе со стартом 100;
   - до конца матча нет `review` и очков соперника; закончивший первым видит `opponentDone: false → true`;
   - срок старта: никто → `void`, рейтинг не тронут; один → он проиграл;
   - брошенная часть 121 с → сдача; 119 с → ещё нет;
   - сдача посреди матча → соперник доигрывает, итог — победа соперника независимо от очков;
   - старые проверки 9.5 из `docs/ELO.md` (409 на повтор, таймаут, повторный `next`, чужой матч → 404, двойное завершение) — переписать под новую схему;
   - ни один ответ API до конца матча не содержит `answer`, `explanation`, `qid`.
4. Ручная проверка: два браузера (обычный + инкогнито) на локальном хранилище — поиск, подбор, параллельная игра, итог.

---

## 9. Этапы

После каждого этапа: план → `coder` → `reviewer` → исправления. Сборка может быть красной **только между этапами L1 и L3** и только в файлах следующих этапов; коммит — после L3, когда `npx tsc --noEmit`, `npm run lint`, `npx next build` и все тесты зелёные.

### L1. Конфиг, база, хранилище
- **Файлы:** `src/lib/elo-config.ts`, `src/lib/elo.ts` (+ `elo.test.ts`), `supabase/elo.sql`, `supabase/setup.sql`, `supabase/elo-check.sql`, `src/lib/elo-store.ts` (+ `elo-store.test.ts`), `src/lib/elo-admin-data.ts` (+ тест).
- **Критерии:** `npm run elo:test`, `npm run elo:store-test` зелёные; SQL перезапускается без ошибок; миграция переводит старые статусы в `void`; SQL к боевой базе **не** применять (это делает владелец: `npm run db:apply -- supabase/elo.sql`).

### L2. Сервер и API
- **Файлы:** `src/lib/elo-server.ts` (+ `elo-server.test.ts`), `src/lib/elo-api-types.ts`, `src/app/api/ranked/**` (новый `queue/route.ts`, удалить `play/`).
- **Критерии:** `npm run elo:server-test` зелёный (тесты 8.3); ошибок `tsc` нет нигде, кроме `src/components/ranked/*` и `src/components/admin/RankedTab.tsx`.

### L3. Интерфейс и документация
- **Файлы:** `src/components/ranked/*`, `src/components/admin/RankedTab.tsx`. Документация: этот файл остаётся источником правды по ревизии 2; в `docs/ELO.md` у заменённых мест стоят ссылки сюда.
- **Критерии:** `tsc`, `lint`, `build` чистые; ручная проверка 8.4; скриншоты 390 и 1440 px в обеих темах (поиск, «соперник найден», ожидание итога, итог); отсчёты не зависят от часов устройства.

---

## 10. Решения по умолчанию (владелец может поменять)

| # | Вопрос | По умолчанию |
|---|---|---|
| 1 | Связь с сервером | Опрос раз в 2 с, без Supabase Realtime и новых зависимостей |
| 2 | Окно рейтинга | ±100, +100 каждые 30 с, с 2:00 — любой рейтинг; работает большее окно из двух |
| 3 | Длительность поиска | 5 минут, затем «никого не нашли» |
| 4 | Срок старта | 90 с; не начал один — поражение, никто — `void` |
| 5 | Брошенная часть | 2 минуты без признаков жизни = сдача |
| 6 | Сдача соперника | Оставшийся доигрывает; итог применяется в конце |
| 7 | Разбор с ответами | После завершения всего матча (было: после своей части) |
| 8 | Набор вопросов | По рейтингу того, кто дольше искал (он A) |
| 9 | Повторная встреча пары | Не чаще раза в 24 ч — при малом онлайне будет мешать; можно снизить до 1 ч |
| 10 | Лимиты | 30 матчей в сутки; лимит «3 в ожидании» убран |
| 11 | Старые незаконченные матчи | Становятся `void`, рейтинг не меняется |

---

## 11. Реализация: что добавлено или уточнено по сравнению с текстом выше

- **Где разбираются матчи.** `resolveMatch` вызывают хаб, страница матча, `next`, вход в очередь и `leave`. Опрос и отмена очереди матчи не трогают (они идут каждые 2 с, а ищущий игрок не может быть в матче).
- **Сдача записывается первой.** `store.setForfeit(id, side)` ставит `forfeit` только пока матч `playing` и `forfeit` пуст (в Supabase — `PATCH …&status=eq.playing&forfeit=is.null`); только потом аннулируются вопросы и пишутся очки. Иначе параллельный запрос соперника успевал закрыть часть без сдачи и сдавшийся мог выиграть.
- **Кто сдался первым.** Если отказались обе стороны, проигрывает та, у кого момент отказа раньше: неявка — `start_by`, брошенная часть — последний признак жизни + 120 с; при равенстве — A. `leave` сначала разбирает матч: если соперник уже бросил свою часть, сдаётся он.
- **Сдача до первого вопроса** считается стартом: если соперник так и не пришёл, проигрывает сдавшийся (а не `void`). Сознательно: «сдача = поражение».
- **Самовосстановление.** `resolveMatch` первым делом завершает `playing`-матч, у которого записаны очки обеих сторон (если раньше упал `finishMatch`). Матч `playing` без `player_b` (аккаунт удалён) становится `void`.
- **`review`** — `null`, пока матч `playing`, и когда разбирать нечего (`void`, где никто не начал).
- **Лимит 30 матчей в сутки** проверяет хранилище в `queueJoin` (`EloLimitError` → 429) до блокировки очереди: в редкой гонке возможен 31-й матч.
- **SQL.** Вспомогательные функции `elo_queue_rule`, `elo_queue_window`, `elo_queue_state`, `elo_queue_sweep`, `elo_queue_try_match` (отозваны у клиентов, без grant); уникальные индексы `elo_matches_one_playing_as_a` / `_as_b`. Уборка очереди удаляет строку без опроса дольше 15 с (ровно 15 — остаётся) и строки `matched` всех игроков, чей матч уже не `playing`. `elo-check.sql` гоняет очередь на «завтрашних» часах, чтобы не задеть настоящие строки, и всё откатывает.
- **Локальное хранилище** (`.data/elo.json`) при загрузке переводит старые статусы в `void` (`migrateLocalDb`) — как миграция в SQL.
- **Сигнал присутствия — из Web Worker.** В фоновой вкладке Chrome примерно через минуту растягивает обычный `setInterval` с 2 с до 16–60 с, и сервер выкидывал игрока (15 с без опроса). Опрос очереди тикает из маленького воркера (`useWorkerInterval`, его таймеры так не тормозятся; запасной вариант — обычный `setInterval`). Если игрока всё же выкинуло, вместо молчаливого сброса — «Your search stopped.» и «Search again».
- **`elo-check.sql`** проверен на PGlite (Postgres в WASM): чистая база, повторный запуск, обновление со старой схемы. Нашлась одна ошибка самой проверки (подзапрос `count` в одном `IF` с вызовами отмены выполнялся раньше них) — исправлено.
- **Применено к боевой базе 2026-11-22** по просьбе владельца: `npm run db:apply -- supabase/elo.sql supabase/elo-admin.sql supabase/elo-check.sql` — все три OK (проверка прошла). При следующих правках SQL — тот же порядок.
