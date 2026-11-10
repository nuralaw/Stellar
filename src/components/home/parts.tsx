import Link from "next/link";

// Small building blocks shared by Home (Dashboard) and Statistics.

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface p-5 ${className}`}>{children}</div>;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />;
}

export function EmptyChart({ text, href = "/practice", link = "Start practicing" }: { text: string; href?: string; link?: string }) {
  return (
    <div className="grid h-44 place-content-center rounded-xl border border-dashed border-line px-6 text-center">
      <p className="text-sm text-muted">{text}</p>
      <Link href={href} className="mt-2 text-sm font-semibold text-primary hover:underline">
        {link} →
      </Link>
    </div>
  );
}

/** Next round hundred above the latest score, capped at the target: a near finish line. */
export function milestone(latest: number, target: number) {
  return Math.min(target, Math.floor(latest / 100) * 100 + 100);
}
