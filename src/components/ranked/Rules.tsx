import { WARN_ICON } from "@/components/compete/CompeteRound";
import { Icon } from "@/components/bank/icons";

/** What the player agrees to before a match: shown in the hub's start dialog and on the match's ready screen. */
export function Rules({ fullscreen }: { fullscreen: boolean }) {
  return (
    <ul className="space-y-2 text-sm text-muted">
      <li>
        • <span className="font-semibold text-ink">10 questions, one at a time</span> (5 Reading &amp; Writing, 5 Math), each with its own timer. You can&apos;t go back.
      </li>
      <li>
        • <span className="font-semibold text-ink">Points for right and fast.</span> A correct answer scores 100 / 150 / 200 by difficulty, plus up to 40% for speed. Wrong or late is 0.
      </li>
      <li>
        •{" "}
        {fullscreen ? (
          <>
            <span className="font-semibold text-ink">The match opens in full screen.</span> Leaving it (Esc, switching tabs) scores the current question 0.
          </>
        ) : (
          <>
            <span className="font-semibold text-ink">Stay on this page.</span> Switching apps or tabs scores the current question 0.
          </>
        )}{" "}
        Away for more than <span className="font-semibold text-danger">15 seconds</span> counts as giving up: a loss.
      </li>
      <li>• Answers and explanations appear after your part is done.</li>
    </ul>
  );
}

export function RulesIcon() {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-full bg-danger-soft text-danger">
      <Icon d={WARN_ICON} className="h-6 w-6" strokeWidth={2} />
    </span>
  );
}
