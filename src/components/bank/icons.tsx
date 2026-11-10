// Small stroke icons used across the question bank (24×24, currentColor).

export const I = {
  star: "m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z",
  chevronL: "M15 18l-6-6 6-6",
  chevronR: "M9 18l6-6-6-6",
  chevronD: "M6 9l6 6 6-6",
  check: "M5 12.5l4.5 4.5L19 7",
  x: "M7 7l10 10M17 7 7 17",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4-4",
  filter: "M4 6h16M7 12h10M10 18h4",
  shuffle: "M16 4h4v4M4 20 20 4M20 16v4h-4M15 15l5 5M4 4l5 5",
  play: "M8 5.5v13l11-6.5-11-6.5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l2.5 2.5",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  flag: "M5 21V4m0 0h11l-2 4 2 4H5",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  eyeOff: "M3 3l18 18M10.6 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.7 3.6M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2",
  sort: "M7 4v16m0 0-3-3m3 3 3-3M17 20V4m0 0-3 3m3-3 3 3",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9.5a1.5 1.5 0 1 0 0-.01",
  inbox: "M4 13h4l1.5 3h5L16 13h4M5 5h14l1 8v6H4v-6l1-8Z",
  undo: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  layers: "M12 3 2 8l10 5 10-5-10-5ZM2 12l10 5 10-5M2 16l10 5 10-5",
  badge: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-3.5 9 2.5 2.5 4.5-4.5",
  keyboard: "M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10",
} as const;

export function Icon({ d, className = "h-5 w-5", filled, strokeWidth = 1.8 }: { d: string; className?: string; filled?: boolean; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
