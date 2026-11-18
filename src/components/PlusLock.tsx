import Link from "next/link";
import type { ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import { PlusMark } from "@/components/plus/PlusMark";
import { BTN_ON_DARK, BTN_PRIMARY, BTN_QUIET, LINK_ON_DARK, LINK_STRONG, PLUS_SURFACE } from "@/components/plus/styles";
import { plusCtaLabel, priceHint } from "@/lib/plus-config";

// How Stellar Plus shows up where something is locked. Server-safe (no hooks): lead with what you get, say the price at
// the moment of intent, and always leave a free next step. At most one per screen.

/** Small "Plus" pill for labels of Plus-only things (a profile card, a tab). */
export function PlusBadge({ tone = "light", className = "" }: { tone?: "light" | "onDark"; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] leading-none font-semibold ${
        tone === "onDark" ? "bg-primary/15 text-accent" : "bg-accent-soft text-primary-strong ring-1 ring-primary-strong/20 ring-inset"
      } ${className}`}
    >
      <Icon d={I.star} filled className="h-2.5 w-2.5" />
      Plus
    </span>
  );
}

export type PlusFeature = "tests" | "lessons" | "insights" | "review" | "bank";

export interface PlusLockProps {
  variant: "panel" | "card" | "row";
  /** "What's in Plus" link target /plus#<feature> (panel); "bank" has no section of its own and goes to /plus#compare. */
  feature: PlusFeature;
  title: string;
  body?: string;
  /** Up to 3 feature-specific benefits (panel, card). */
  points?: string[];
  /** One line with a real count. */
  fact?: string;
  /** Visual on the right (card only). */
  preview?: ReactNode;
  /** The free next step (panel, card). */
  free?: { href: string; label: string };
  /** Default { label: plusCtaLabel(), href: "/plus#plans" }. */
  cta?: { label: string; href: string };
  /** Extra control next to the CTA, e.g. a hide button (card, row). */
  aside?: ReactNode;
  /** Panel: e.g. a sign-in hint. */
  footer?: ReactNode;
  headingLevel?: 2 | 3;
  /** Row only: no border, background or padding (when nested in another card). */
  bare?: boolean;
  className?: string;
}

export function PlusLock({ variant, feature, title, body, points, fact, preview, free, cta, aside, footer, headingLevel = 2, bare = false, className = "" }: PlusLockProps) {
  const H = headingLevel === 3 ? "h3" : "h2";
  const action = cta ?? { label: plusCtaLabel(), href: "/plus#plans" };
  const hint = priceHint();
  const hintText = (cls: string) =>
    hint && (
      <span className={cls}>
        <span aria-hidden="true">{hint.text}</span>
        <span className="sr-only">{hint.sr}</span>
      </span>
    );

  if (variant === "panel") {
    return (
      <section aria-labelledby="plus-lock-title" className={`overflow-hidden rounded-3xl p-6 sm:p-8 ${PLUS_SURFACE} ${className}`}>
        <p className="flex items-center gap-2.5">
          <PlusMark size="sm" />
          <span className="text-xs font-semibold tracking-[0.14em] text-side-ink/80 uppercase">Stellar Plus</span>
        </p>
        <H id="plus-lock-title" className="mt-4 text-2xl font-bold tracking-tight text-balance text-side-ink">
          {title}
        </H>
        {body && <p className="mt-2 text-side-ink/80">{body}</p>}
        {points && (
          <ul className="mt-5 space-y-2.5 text-[15px] text-side-ink/80">
            {points.map((x) => (
              <li key={x} className="flex gap-2.5">
                <Icon d={I.check} className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={2.4} />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        )}
        {fact && <p className="mt-5 text-sm text-side-ink/80">{fact}</p>}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href={action.href} className={`${BTN_ON_DARK} w-full sm:w-auto`}>
            {action.label}
            <Icon d={I.chevronR} className="h-4 w-4" strokeWidth={2.2} />
          </Link>
          {hintText("text-sm text-side-ink/80")}
        </div>
        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {free && (
            <Link href={free.href} className={LINK_ON_DARK}>
              Or keep going free: {free.label} →
            </Link>
          )}
          <Link href={feature === "bank" ? "/plus#compare" : `/plus#${feature}`} className={LINK_ON_DARK}>
            What&apos;s in Plus
          </Link>
        </p>
        {footer}
      </section>
    );
  }

  if (variant === "card") {
    return (
      <div className={`rounded-2xl border border-primary-strong/20 bg-linear-to-br from-primary-soft to-surface to-60% p-5 sm:p-6 ${className}`}>
        <div className={preview ? "grid gap-5 md:grid-cols-[minmax(0,1fr)_16rem] md:items-center" : ""}>
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <PlusMark size="md" />
              <div className="min-w-0">
                <H id="plus-lock-title" className="text-lg font-semibold">
                  {title}
                </H>
                {body && <p className="mt-1 text-sm text-muted">{body}</p>}
                {fact && <p className="mt-1 text-sm text-muted">{fact}</p>}
              </div>
            </div>
            {points && (
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                {points.map((x) => (
                  <li key={x} className="flex items-center gap-1.5">
                    <Icon d={I.check} className="h-4 w-4 shrink-0 text-primary-strong" strokeWidth={2.4} />
                    {x}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <Link href={action.href} className={`${BTN_PRIMARY} text-sm`}>
                {action.label}
              </Link>
              {hintText("text-[13px] text-muted")}
              {free && (
                <Link href={free.href} className={`text-sm ${LINK_STRONG}`}>
                  {free.label}
                </Link>
              )}
              {aside}
            </div>
          </div>
          {preview && <div className="min-w-0">{preview}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 ${bare ? "" : "rounded-2xl border border-line bg-surface px-4 py-3.5 sm:px-5"} ${className}`}>
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <PlusMark size="sm" className="mt-0.5" />
        <div className="min-w-0">
          <H id="plus-lock-title" className="text-[15px] font-semibold">
            {title}
          </H>
          {fact && <p className="mt-0.5 text-sm text-muted">{fact}</p>}
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        {hintText("text-[13px] text-muted")}
        <Link href={action.href} className={BTN_QUIET}>
          {action.label}
        </Link>
        {aside}
      </div>
    </div>
  );
}
