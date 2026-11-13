import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/admin/ResetPassword";
import { StudentSignIn } from "@/components/auth/StudentSignIn";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

// StudentSignIn reads ?next= and ?auth= with useSearchParams, so it needs a Suspense boundary (prerendered shell + client render).
export default function Page() {
  return (
    <Suspense
      fallback={
        <AuthCard title="Sign in">
          <p className="text-sm text-muted">Loading…</p>
        </AuthCard>
      }
    >
      <StudentSignIn />
    </Suspense>
  );
}
