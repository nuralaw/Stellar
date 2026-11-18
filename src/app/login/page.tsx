import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { StudentSignIn } from "@/components/auth/StudentSignIn";
import { authFacts } from "@/lib/auth-facts";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

// StudentSignIn reads ?next= and ?auth= with useSearchParams, so it needs a Suspense boundary (prerendered shell + client render).
export default function Page() {
  return (
    <AuthScreen mode="signin" facts={authFacts()}>
      <Suspense
        fallback={
          <AuthPanel title="Sign in">
            <p className="text-sm text-muted">Loading…</p>
          </AuthPanel>
        }
      >
        <StudentSignIn mode="signin" />
      </Suspense>
    </AuthScreen>
  );
}
