"use client";

import { I, Icon } from "@/components/bank/icons";
import { FOCUS } from "@/components/plus/styles";
import { CarouselSlides, CarouselTimer, useCarousel, type CarouselSlide } from "./carousel";

// The Features tab of /register and /login: a progress bar (one segment per slide), Previous / Play-Pause / Next, and the
// slides. The state machine lives in ./carousel.

export type FeatureSlide = CarouselSlide;

const INTERVAL_MS = 7000;

const ROUND_BTN = `grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-surface-2 ${FOCUS}`;

export function FeatureCarousel({ slides }: { slides: FeatureSlide[] }) {
  const c = useCarousel(slides.length, { intervalMs: INTERVAL_MS });
  const { cur } = c;

  return (
    <section aria-roledescription="carousel" aria-label="Stellar features" {...c.root}>
      <div className="flex items-center gap-4">
        <ol aria-label="Choose a feature" className="flex flex-1 gap-1.5">
          {slides.map((s, i) => (
            <li key={s.id} className="min-w-0 flex-1">
              <button
                type="button"
                aria-label={`Show ${s.label}`}
                aria-current={i === cur ? "true" : undefined}
                onClick={() => c.pick(i)}
                className={`group block w-full py-2.5 ${FOCUS}`}
              >
                <span className="relative block h-1.5 overflow-hidden rounded-full bg-line">
                  <span className={`absolute inset-0 origin-left rounded-full bg-primary transition-transform ${i < cur ? "" : "scale-x-0"}`} />
                  {i === cur && <CarouselTimer c={c} className="absolute inset-0 rounded-full bg-primary" />}
                </span>
                <span className="mt-2 hidden truncate text-left text-xs font-medium text-muted group-aria-[current=true]:text-ink xl:block">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={c.back} aria-label="Previous feature" className={ROUND_BTN}>
            <Icon d={I.chevronL} />
          </button>
          {!c.reduced && (
            <button type="button" onClick={() => c.setPlaying((p) => !p)} aria-label={c.playing ? "Pause slideshow" : "Play slideshow"} className={ROUND_BTN}>
              {c.playing ? <Icon d="M9 6v12M15 6v12" /> : <Icon d={I.play} />}
            </button>
          )}
          <button type="button" onClick={c.next} aria-label="Next feature" className={ROUND_BTN}>
            <Icon d={I.chevronR} />
          </button>
        </div>
      </div>

      <CarouselSlides c={c} slides={slides} className="mt-6" />
    </section>
  );
}
