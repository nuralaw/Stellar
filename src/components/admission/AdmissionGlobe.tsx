"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GlobeHandle } from "./globe-scene";

// The spinning globe on /admission. three.js is loaded on demand (globe-scene.ts), so no other page pays for it.
// Purely a pointer toy: the whole thing is aria-hidden, keyboard and screen-reader users use the destination list next to it.

interface GlobeDestination {
  slug: string;
  name: string;
  lat: number;
  lon: number;
}

export function AdmissionGlobe({ destinations }: { destinations: GlobeDestination[] }) {
  const container = useRef<HTMLDivElement>(null);
  const markerEls = useRef<(HTMLAnchorElement | null)[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    const box = container.current;
    if (!box) return;
    // Every effect run owns a fresh canvas: a canvas whose context was force-lost on cleanup can't get a new one, so it is never reused.
    const cv = document.createElement("canvas");
    cv.className = "absolute inset-0 h-full w-full cursor-grab opacity-0 transition-opacity duration-500 active:cursor-grabbing";
    box.insertBefore(cv, markerEls.current.find(Boolean) ?? null);
    const abort = new AbortController();
    let handle: GlobeHandle | null = null;
    (async () => {
      try {
        const { createGlobe } = await import("./globe-scene");
        if (abort.signal.aborted) return;
        const markers = destinations.flatMap((d, i) => {
          const el = markerEls.current[i];
          return el ? [{ el, lat: d.lat, lon: d.lon }] : [];
        });
        const created = await createGlobe({ container: box, canvas: cv, markers, onContextLost: () => setStatus("failed"), signal: abort.signal });
        if (abort.signal.aborted) {
          created.dispose(); // unmounted while setting up (dev StrictMode mounts twice)
          return;
        }
        handle = created;
        cv.style.opacity = "1";
        setStatus("ready");
      } catch {
        if (!abort.signal.aborted) setStatus("failed");
      }
    })();
    return () => {
      abort.abort();
      handle?.dispose();
      cv.remove();
      // The component outlives its effect (a page kept alive hidden, StrictMode, Fast Refresh): show the skeleton again while the next run sets up.
      setStatus("loading");
    };
  }, [destinations]);

  return (
    <div>
      {/* A fixed square from the first paint, so nothing shifts when the canvas appears. Gone when WebGL isn't available. */}
      <div
        ref={container}
        aria-hidden="true"
        className={`relative mx-auto aspect-square w-full max-w-[560px] touch-pan-y select-none ${status === "failed" ? "hidden" : ""}`}
      >
        {/* soft glow behind the sphere; the sphere covers 88% of the box */}
        <div className="pointer-events-none absolute -inset-[2%] rounded-full bg-primary opacity-[0.12] blur-3xl dark:opacity-[0.16]" />
        {status === "loading" && <div className="absolute inset-[6%] animate-pulse rounded-full bg-surface-2 motion-reduce:animate-none" />}
        {destinations.map((d, i) => (
          <Link
            key={d.slug}
            href={`/admission/${d.slug}`}
            prefetch
            tabIndex={-1}
            draggable={false}
            data-zoom="off"
            ref={(el) => {
              markerEls.current[i] = el;
            }}
            style={{ visibility: "hidden" }}
            className="absolute top-0 left-0 flex h-11 items-center gap-2 rounded-full border border-line bg-surface/90 pr-3.5 pl-4 text-sm font-semibold whitespace-nowrap text-ink shadow-sm backdrop-blur hover:border-primary"
          >
            {/* the dot's centre is 22px from the left edge (MARKER_ANCHOR in globe-scene.ts) */}
            <span className="relative flex size-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-3 rounded-full bg-primary" />
            </span>
            {d.name}
          </Link>
        ))}
      </div>
      {status === "failed" && <p className="mt-3 text-center text-sm text-muted">The 3D globe isn&apos;t available on this device. Pick a destination from the list.</p>}
    </div>
  );
}
