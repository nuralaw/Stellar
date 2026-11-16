"use client";

import { showToast } from "@/lib/toast";
import { parentMessage } from "@/lib/plus-config";

/** "Send to a parent": the share sheet where there is one, else the message and link are copied. */
export function ShareWithParent({ tests, lessons, className, label = "Send to a parent" }: { tests: number; lessons: number; className: string; label?: string }) {
  const share = async () => {
    const url = `${location.origin}/plus#parents`;
    const text = parentMessage(tests, lessons);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Stellar Plus", text, url });
        return;
      } catch (e) {
        if ((e as DOMException).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      showToast("Link copied", "Paste it into a message to your parent.");
    } catch {
      showToast("Copy this link", url, 8000);
    }
  };
  return (
    <button type="button" className={className} onClick={share}>
      {label}
    </button>
  );
}
