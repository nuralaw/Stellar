import { I, Icon } from "@/components/bank/icons";

/** Search field with a magnifier and a clear button (used by the Inbox and Accounts tabs). */
export function SearchBox({ value, onChange, placeholder, maxLength, onSubmit }: { value: string; onChange: (v: string) => void; placeholder: string; maxLength?: number; onSubmit?: () => void }) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <Icon d={I.search} className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={maxLength}
        onKeyDown={
          onSubmit
            ? (e) => {
                if (e.key === "Enter" && !e.repeat && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  onSubmit();
                }
              }
            : undefined
        }
        className="h-11 w-full rounded-xl border border-line bg-bg pr-11 pl-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-0.5 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-ink"
        >
          <Icon d={I.x} className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
