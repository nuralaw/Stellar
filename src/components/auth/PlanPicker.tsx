"use client";

import { useState, type KeyboardEvent } from "react";
import { FOCUS } from "@/components/plus/styles";
import { PLAN_ORDER, PLUS, discountedCents, formatPrice, priceParts, type PlanId } from "@/lib/plus-config";

// Landing page Pricing section and /plus: a two-way switch (Monthly / Until test day) with a sliding pill, the price beside it.

/**
 * Uncontrolled by default (landing page); pass `value` + `onChange` to control it (/plus keeps the choice to drive the buy button).
 * `discountPercent` (/plus, signed-in student with a discount) shows Monthly's first-month price, the normal one struck through.
 */
export function PlanPicker({ value, onChange, discountPercent }: { value?: PlanId; onChange?: (id: PlanId) => void; discountPercent?: number } = {}) {
  const [own, setOwn] = useState<PlanId>("monthly");
  const id = value ?? own;
  const setId = (next: PlanId) => {
    setOwn(next);
    onChange?.(next);
  };
  const idx = PLAN_ORDER.indexOf(id);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const to = PLAN_ORDER[(idx + step + PLAN_ORDER.length) % PLAN_ORDER.length];
    setId(to);
    document.getElementById(`auth-plan-${to}`)?.focus();
  };

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 xl:flex-nowrap">
      <div role="radiogroup" aria-label="Plan" onKeyDown={onKeyDown} className="relative grid w-56 shrink-0 grid-cols-2 rounded-full bg-surface-2 p-1 ring-1 ring-line">
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-surface shadow-sm ring-1 ring-line transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: `translateX(${idx * 100}%)` }}
        />
        {PLAN_ORDER.map((pid) => {
          const active = pid === id;
          return (
            <button
              key={pid}
              type="button"
              id={`auth-plan-${pid}`}
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setId(pid)}
              className={`relative z-10 rounded-full px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${active ? "text-ink" : "text-muted"} ${FOCUS}`}
            >
              {PLUS.plans[pid].name}
            </button>
          );
        })}
      </div>
      {/* Stable live region. Every plan's price block sits in the same grid cell, so the cell is as big as the biggest one and
          switching never resizes the card; the inactive blocks are invisible. The active block is keyed apart from its hidden
          twin, so a switch remounts it (replays the animation, and the change is announced). */}
      <div aria-live="polite" className="grid">
        {PLAN_ORDER.map((pid) =>
          pid === id ? (
            <div key={`on-${pid}`} className="lesson-in [grid-area:1/1]">
              <PriceBlock id={pid} discountPercent={discountPercent} />
            </div>
          ) : (
            <div key={`off-${pid}`} aria-hidden="true" className="invisible [grid-area:1/1]">
              <PriceBlock id={pid} discountPercent={discountPercent} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

/** The price (or "Coming soon") and its one-line note for one plan. */
function PriceBlock({ id, discountPercent }: { id: PlanId; discountPercent?: number }) {
  const p = PLUS.plans[id];
  const c = p.amountCents;
  const parts = c !== null ? priceParts(c) : null;
  if (discountPercent && p.billing === "month" && !p.comingSoon && c !== null) {
    const first = discountedCents(c, discountPercent);
    const fp = priceParts(first);
    return (
      <>
        <p className="flex items-baseline">
          <span className="sr-only">
            {formatPrice(first)} for the first month, was {formatPrice(c)}. Then {formatPrice(c)} per month.
          </span>
          <span aria-hidden="true" className="text-3xl font-bold tracking-tight tabular-nums">
            {fp.whole}
          </span>
          <span aria-hidden="true" className="text-xl font-bold tabular-nums">
            {fp.frac}
          </span>
          <span aria-hidden="true" className="ml-1.5 text-sm text-muted tabular-nums">
            <s>{formatPrice(c)}</s>
          </span>
        </p>
        <p className="text-[12px] text-muted">First month. Then {formatPrice(c)}/month until you cancel.</p>
      </>
    );
  }
  return (
    <>
      {p.comingSoon ? (
        <p className="text-2xl font-semibold text-muted">Coming soon</p>
      ) : c !== null && parts ? (
        <p className="flex items-baseline">
          <span className="sr-only">
            {formatPrice(c)} {p.billing === "month" ? "per month" : "one payment"}
          </span>
          <span aria-hidden="true" className="text-3xl font-bold tracking-tight tabular-nums">
            {parts.whole}
          </span>
          <span aria-hidden="true" className="text-xl font-bold tabular-nums">
            {parts.frac}
          </span>
          <span aria-hidden="true" className="ml-1.5 text-sm text-muted">
            {p.billing === "month" ? "/ month" : "one payment"}
          </span>
        </p>
      ) : (
        <p className="text-2xl font-semibold text-muted">Price at launch</p>
      )}
      <p className="text-[12px] text-muted">
        {p.billing === "month" ? "Renews every month until you cancel." : p.comingSoon ? "One payment until your SAT. Not on sale yet." : "One payment. Nothing renews."}
      </p>
    </>
  );
}
