import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { PAGE } from "@/lib/ui";

export const metadata: Metadata = { title: "Support list", robots: { index: false, follow: false } };

// AdminPanel reads ?tab= with useSearchParams, so it needs a Suspense boundary (prerendered shell + client render).
export default function Page() {
  return (
    <Suspense fallback={<section className={PAGE}><p className="text-muted">Loading…</p></section>}>
      <AdminPanel />
    </Suspense>
  );
}
