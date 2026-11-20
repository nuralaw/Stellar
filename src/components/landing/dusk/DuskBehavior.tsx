"use client";

import { useEffect, useLayoutEffect } from "react";

// The landing page's behaviour (port of the design's script.js). Everything is optional: the sky, the path and the sun are
// pure CSS, and the page is complete without this. Jobs: chapter reveal, "pause off-screen" for the app widgets, the mobile
// dock, the SAT countdown (+ the hero chip), the one-time twinkle, and "Follow the path" (a slow automatic scroll).
// Nothing here listens to the scroll position; the effect undoes everything it did when the page unmounts.

const JS_ATTR = "data-dusk-js";
const REVEAL_ATTR = "data-dusk-reveal";
/** On <html> while the landing is NOT the visible page (after a client-side navigation away it can stay in the document, hidden). */
const AWAY_ATTR = "data-dk-away";

type Off = () => void;

/** Mounted copies of the page. After a client-side navigation the old one may stay (hidden) next to the new one, so the html flags are only taken away when the last one goes. */
let mounted = 0;

export function DuskBehavior() {
  // The inline script in DuskLanding sets the flag before first paint on a full page load; a client-side navigation
  // to "/" doesn't run it, so set it here before the browser paints. Layout effects are also undone when the page is
  // hidden or removed, which is what lets the CSS give the app frame back (see AWAY_ATTR and dusk.css).
  useLayoutEffect(() => {
    const html = document.documentElement;
    mounted++;
    html.removeAttribute(AWAY_ATTR);
    html.setAttribute(JS_ATTR, "");
    return () => {
      mounted--;
      if (mounted > 0) return;
      html.removeAttribute(JS_ATTR);
      html.setAttribute(AWAY_ATTR, "");
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById("dk-root");
    if (!root) return;
    const html = document.documentElement;
    const offs: Off[] = [];
    const on = <T extends EventTarget>(target: T, type: string, fn: (e: Event) => void, opts?: AddEventListenerOptions | boolean) => {
      target.addEventListener(type, fn, opts);
      offs.push(() => target.removeEventListener(type, fn, opts));
    };
    const $ = <E extends Element = HTMLElement>(sel: string) => root.querySelector<E>(sel);
    const $$ = <E extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<E>(sel));

    const hasIO = "IntersectionObserver" in window;
    const motionMQ = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const motionOK = motionMQ.matches;

    /* Reveal: chapters 1-5 fade up once */
    if (motionOK && hasIO) {
      html.setAttribute(REVEAL_ATTR, "");
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -12% 0px" },
      );
      $$(".chapter__inner").forEach((el) => io.observe(el));
      offs.push(() => {
        io.disconnect();
        html.removeAttribute(REVEAL_ATTR);
      });
    }

    /* App widgets (Features carousel, Pricing): their entrance animations and autoplay timers run only while on screen.
       The CSS pauses everything inside [data-dk-watch] until data-inview="true" (see dusk.css). */
    const watched = $$("[data-dk-watch]");
    if (hasIO) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            (e.target as HTMLElement).dataset.inview = e.isIntersecting ? "true" : "false";
          });
        },
        { threshold: 0, rootMargin: "0px 0px -8% 0px" },
      );
      watched.forEach((el) => io.observe(el));
      offs.push(() => {
        io.disconnect();
        watched.forEach((el) => el.removeAttribute("data-inview"));
      });
    } else {
      watched.forEach((el) => (el.dataset.inview = "true"));
    }

    /* Dock: mobile call-to-action bar, hidden while a CTA or the dusk band is near the bottom */
    const dock = $("[data-dock]");
    if (dock && hasIO) {
      const wide = window.matchMedia("(min-width: 768px)");
      const hits = new Set<Element>();
      const update = () => dock.classList.toggle("is-shown", !wide.matches && hits.size === 0);
      const watch: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) hits.add(entry.target);
          else hits.delete(entry.target);
        });
        update();
      };
      const ctas = new IntersectionObserver(watch, { threshold: 0 });
      $$("[data-dock-hide]").forEach((el) => ctas.observe(el));
      const band = $(".dusk");
      const bandIo = band ? new IntersectionObserver(watch, { rootMargin: "-90% 0px 0px 0px" }) : null;
      if (band && bandIo) bandIo.observe(band);
      on(wide, "change", update);
      offs.push(() => {
        ctas.disconnect();
        bandIo?.disconnect();
        dock.classList.remove("is-shown");
      });
    }

    /* Countdown: next official SAT, at the start hour local time, days and hours, once a minute.
       The same dates also feed the small "Next SAT" chip in the hero. */
    const box = $("[data-countdown]");
    const live = box?.querySelector<HTMLElement>(".countdown__face--live");
    if (box && live) {
      const startHour = Number(box.dataset.startHour) || 8;
      const dates = Array.from(box.querySelectorAll<HTMLTimeElement>(".countdown__face--static time[datetime]"))
        .map((t) => {
          const iso = t.getAttribute("datetime") ?? "";
          const p = iso.split("-").map(Number);
          return { iso, at: new Date(p[0], p[1] - 1, p[2], startHour, 0, 0) };
        })
        .filter((d) => !isNaN(d.at.getTime()));
      const el = {
        days: live.querySelector<HTMLElement>(".count__days")!,
        unit: live.querySelector<HTMLElement>(".count__unit")!,
        hours: live.querySelector<HTMLElement>(".count__hours")!,
        sr: live.querySelector<HTMLElement>("[data-count-sr]")!,
        date: live.querySelector<HTMLElement>(".count__date time")!,
        later: live.querySelector<HTMLElement>(".count__later")!,
      };
      const chip = $("[data-next-chip]");
      const chipEl = chip && { date: chip.querySelector<HTMLElement>("[data-chip-date]")!, left: chip.querySelector<HTMLElement>("[data-chip-left]")! };
      const dayMonth = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
      const longDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
      const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
      const pad = String(startHour).padStart(2, "0");
      let timer: ReturnType<typeof setTimeout> | undefined;
      const onScreen = new Set<Element>();
      let near = false;

      const render = () => {
        const now = Date.now();
        const i = dates.findIndex((d) => d.at.getTime() > now);
        if (i < 0) {
          /* after the last date: the static list stays, the live face stays hidden */
          box.classList.remove("is-live");
          chip?.classList.remove("is-live");
          return false;
        }
        const ms = dates[i].at.getTime() - now;
        const days = Math.floor(ms / 86400000);
        const hours = Math.floor((ms % 86400000) / 3600000);
        const dayText = days === 1 ? "1 day" : days + " days";
        const hourText = days === 0 && ms < 3600000 ? "less than 1 hour" : hours === 1 ? "1 hour" : hours + " hours";
        el.days.textContent = String(days);
        el.unit.textContent = days === 1 ? "day" : "days";
        el.hours.textContent = "and " + hourText;
        el.sr.textContent = dayText + " and " + hourText + " to go.";
        el.date.setAttribute("datetime", `${dates[i].iso}T${pad}:00`);
        el.date.textContent = longDate.format(dates[i].at);
        const rest = dates.slice(i + 1).map((d) => shortDate.format(d.at));
        el.later.textContent = rest.length ? "Later: " + rest.join(" · ") : "";
        box.classList.add("is-live");
        if (chip && chipEl) {
          chipEl.date.setAttribute("datetime", dates[i].iso);
          chipEl.date.textContent = dayMonth.format(dates[i].at);
          chipEl.left.textContent = days > 0 ? dayText : hourText;
          chip.classList.add("is-live");
        }
        return true;
      };

      const schedule = () => {
        clearTimeout(timer);
        timer = undefined;
        if (!near || document.hidden) return;
        timer = setTimeout(() => {
          if (render()) schedule();
        }, 60000 - (Date.now() % 60000) + 50);
      };

      render();
      on(document, "visibilitychange", () => {
        if (!document.hidden && near) render();
        schedule();
      });
      const chapter = document.getElementById("chapter-5");
      const trail = $(".hero__trail");
      if (hasIO && chapter) {
        const watcher = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) onScreen.add(entry.target);
              else onScreen.delete(entry.target);
            });
            near = onScreen.size > 0;
            if (near) render();
            schedule();
          },
          { rootMargin: "200px 0px 200px 0px" },
        );
        watcher.observe(chapter);
        if (trail) watcher.observe(trail);
        offs.push(() => watcher.disconnect());
      } else {
        near = true;
        schedule();
      }
      offs.push(() => {
        clearTimeout(timer);
        box.classList.remove("is-live");
        chip?.classList.remove("is-live");
      });
    }

    /* Twinkle: twelve stars, once, only where scroll timelines exist */
    const arrival = $(".arrival");
    if (arrival && hasIO && motionOK && window.CSS && CSS.supports("animation-timeline: view()")) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            arrival.classList.add("is-twinkling");
            io.disconnect();
          }
        },
        { threshold: 0.5 },
      );
      io.observe(arrival);
      offs.push(() => io.disconnect());
    }

    /* Slow descent. A click on "Follow the path" (JS, no reduced-motion preference) makes the page scroll itself down,
       slowly and continuously, until the final call to action is in view. One small fixed pill shows what is happening
       and has Pause and Stop. Any later input stops it. requestAnimationFrame is used for this feature only. */
    const followPill = $("[data-follow-pill]");
    const followLive = $("[data-follow-live]");
    const followLink = $(".trail-link");
    const followEnd = document.getElementById("start");
    const header = $(".site-header");
    /* Set up whatever the motion preference: the click handler decides (reduced motion: the normal anchor jump). */
    if (followPill && followLive && followLink && followEnd && header) {
      const pill = followPill;
      const q = <E extends Element = HTMLElement>(sel: string) => pill.querySelector<E>(sel)!;
      const pauseBtn = q("[data-follow-pause]");
      const pauseUse = pauseBtn.querySelector("use")!;
      const smooth = (x: number) => x * x * (3 - 2 * x);
      type State = "idle" | "moving" | "paused" | "stopped" | "done";
      let state: State = "idle";
      let autoPaused = false; /* paused because the tab was hidden */
      let expected = 0; /* where the script last put the page, to spot a scrollbar drag */
      let rafId = 0;
      let watchId: ReturnType<typeof setInterval> | undefined;
      let miniId: ReturnType<typeof setTimeout> | undefined; /* auto-dismiss timer of the collapsed control */

      /* the pill rides just under the header until the header has scrolled away */
      const pillY = () => {
        pill.style.setProperty("--dk-follow-y", Math.max(0, header.offsetHeight - window.scrollY) + "px");
      };
      const setPausedUI = (paused: boolean) => {
        pauseBtn.setAttribute("aria-pressed", String(paused));
        pauseUse.setAttribute("href", paused ? "#dk-i-play" : "#dk-i-pause");
      };
      /* the end: the final call to action centred, or the bottom of the page */
      const targetY = () => {
        const r = followEnd.getBoundingClientRect();
        const y = window.scrollY + r.top + r.height / 2 - window.innerHeight / 2;
        return Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
      };

      const end = () => {
        state = "done";
        cancelAnimationFrame(rafId);
        clearInterval(watchId);
        clearTimeout(miniId);
        pill.classList.remove("is-on"); /* is-mini stays until the next start, so the fade-out does not jump */
      };
      const run = () => {
        /* one slow descent from where the page is now */
        state = "moving";
        let pos = window.scrollY;
        expected = pos;
        const started = performance.now();
        let last = started;
        const cruise = Math.min(130, Math.max(80, 0.12 * window.innerHeight)); /* px per second */
        const frame = (now: number) => {
          if (state !== "moving") return;
          if (Math.abs(window.scrollY - expected) > 4) {
            stop(); /* the scrollbar was dragged */
            return;
          }
          const dt = Math.min(now - last, 50) / 1000;
          last = now;
          const left = targetY() - pos;
          if (left <= 0.5) {
            end();
            return;
          }
          const easeIn = smooth(Math.min(1, (now - started) / 1500)); /* about 1.5 s to cruising speed */
          const easeOut = Math.sin((Math.min(1, left / (0.8 * window.innerHeight)) * Math.PI) / 2); /* slows over the last 0.8 screen */
          pos = Math.min(pos + Math.max(16, cruise * easeIn * easeOut) * dt, pos + left);
          window.scrollTo({ top: pos, left: 0, behavior: "instant" });
          expected = window.scrollY;
          pillY();
          rafId = requestAnimationFrame(frame);
        };
        rafId = requestAnimationFrame(frame);
      };
      const launch = () => {
        /* false when there is nothing left to scroll */
        if (targetY() - window.scrollY < 8) return false;
        clearInterval(watchId);
        clearTimeout(miniId);
        watchId = setInterval(() => {
          /* a scrollbar drag while paused */
          if (state === "paused" && Math.abs(window.scrollY - expected) > 4) stop();
        }, 250);
        pill.classList.remove("is-mini", "is-away");
        setPausedUI(false);
        pillY();
        pill.classList.add("is-on");
        run();
        return true;
      };

      /* controls */
      const pause = () => {
        if (state !== "moving") return;
        cancelAnimationFrame(rafId);
        state = "paused";
        setPausedUI(true);
      };
      const resume = () => {
        if (state !== "paused") return;
        setPausedUI(false);
        run();
      };
      function stop() {
        if (state !== "moving" && state !== "paused") return;
        cancelAnimationFrame(rafId);
        autoPaused = false;
        state = "stopped";
        setPausedUI(false);
        pill.classList.add("is-mini", "is-on");
        pillY();
        miniId = setTimeout(autoDismiss, 8000);
      }
      function autoDismiss() {
        /* the collapsed control leaves by itself after 8 s */
        if (state !== "stopped") return;
        if (pill.matches(":hover, :focus-within")) {
          miniId = setTimeout(autoDismiss, 8000);
          return;
        }
        end();
      }
      on(pauseBtn, "click", () => {
        if (state === "paused") resume();
        else pause();
      });
      on(q("[data-follow-stop]"), "click", stop);
      on(q("[data-follow-continue]"), "click", () => {
        if (state === "stopped" && !launch()) end();
      });
      on(q("[data-follow-dismiss]"), "click", end);
      on(followLink, "click", (e) => {
        if (!motionMQ.matches) return; /* reduced motion: the normal jump to chapter 1 */
        if (state === "moving" || state === "paused") {
          e.preventDefault();
          return;
        }
        if (!launch()) return; /* already at the end: the normal anchor */
        e.preventDefault();
        followLive.textContent = "";
        setTimeout(() => {
          followLive.textContent = "Scrolling down slowly. Press any key to stop.";
        }, 150);
      });

      /* any input stops it; the pill's own pointer and Enter/Space use is let through */
      const inUi = (el: EventTarget | null) => el instanceof Element && el.closest("[data-follow-ui]");
      const onInput = (e: Event) => {
        const own = inUi(e.target);
        const target = e.target as Element | null;
        if (state === "stopped") {
          /* never leave the small button over a focused control */
          if (e.type !== "focusin") return;
          if (own) {
            pill.classList.remove("is-away");
            return;
          }
          if (!target?.matches || !target.matches("a, button, summary, input, select, textarea")) return;
          const r = target.getBoundingClientRect();
          const p = pill.getBoundingClientRect();
          pill.classList.toggle("is-away", r.bottom > p.top && r.top < p.bottom && r.right > p.left && r.left < p.right);
          return;
        }
        if (state !== "moving" && state !== "paused") return;
        if (own && !(e.type === "keydown" && (e as KeyboardEvent).key !== "Enter" && (e as KeyboardEvent).key !== " ")) return;
        stop();
      };
      ["wheel", "touchstart", "pointerdown", "keydown", "focusin"].forEach((type) => on(window, type, onInput, { capture: true, passive: true }));
      on(document, "visibilitychange", () => {
        if (document.hidden) {
          if (state === "moving") {
            autoPaused = true;
            pause();
          }
        } else if (autoPaused && state === "paused") {
          autoPaused = false;
          resume();
        }
      });
      on(motionMQ, "change", (e) => {
        /* reduced motion switched on mid-way */
        if (!(e as MediaQueryListEvent).matches) end();
      });
      offs.push(() => {
        cancelAnimationFrame(rafId);
        clearInterval(watchId);
        clearTimeout(miniId);
        state = "done";
        pill.classList.remove("is-on", "is-mini", "is-away");
      });
    }

    /* In-page anchors (route, "Follow the path" when it declines, "See every feature" ...) glide instead of jump, unless the
       visitor prefers reduced motion. Only clicks inside the page: arriving at /#features from another page jumps. */
    on(root, "click", (e) => {
      const ev = e as MouseEvent;
      if (ev.defaultPrevented || !motionMQ.matches || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      const a = (ev.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!a || !target) return;
      ev.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      history.pushState(history.state, "", "#" + id);
      if (target.tabIndex === -1) target.focus({ preventScroll: true });
    });

    return () => offs.splice(0).reverse().forEach((off) => off());
  }, []);

  return null;
}
