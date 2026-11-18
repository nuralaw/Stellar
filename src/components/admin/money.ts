// Money helpers for the admin revenue views. Amounts arrive as integer cents.

/** "$1,234.50"; `short` gives "$1.2k" / "$3.4M" for big numbers (chart labels) and drops ".00" under 1,000. */
export function formatMoney(cents: number, currency = "usd", opts: { short?: boolean } = {}): string {
  const cur = (currency || "usd").toUpperCase();
  const value = cents / 100;
  try {
    if (opts.short) {
      const abs = Math.abs(value);
      if (abs >= 1000) {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, notation: "compact", maximumFractionDigits: 1 }).format(value).replace(/K$/, "k");
      }
      return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(value);
  } catch {
    // Unknown currency code: fall back to a plain number with the code.
    return `${value.toFixed(2)} ${cur}`;
  }
}

/** Change line vs a previous period, in StatTile's tone: up = success colour, down = muted. */
export function moneyDelta(current: number, previous: number, currency: string, prevLabel: string) {
  const diff = current - previous;
  if (diff === 0) return { text: `Same as ${prevLabel}`, cls: "text-muted", arrow: "" };
  if (diff > 0) return { text: `${formatMoney(diff, currency)} more than ${prevLabel}`, cls: "text-success", arrow: "↑" };
  return { text: `${formatMoney(-diff, currency)} less than ${prevLabel}`, cls: "text-muted", arrow: "↓" };
}
