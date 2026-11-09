import Link from "next/link";

export function StarMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 1.5c.5 4.9 1.9 7.9 4.3 9.2 1.6.9 3.6 1.2 6.2 1.3-2.6.1-4.6.4-6.2 1.3-2.4 1.3-3.8 4.3-4.3 9.2-.5-4.9-1.9-7.9-4.3-9.2C6.1 12.4 4.1 12.1 1.5 12c2.6-.1 4.6-.4 6.2-1.3C10.1 9.4 11.5 6.4 12 1.5Z"
        fill="var(--accent)"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink">
      <StarMark />
      <span className="text-lg">Stellar</span>
    </Link>
  );
}
