import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AuthScreen } from "@/components/auth/AuthScreen";
import { StudentSignIn } from "@/components/auth/StudentSignIn";
import { authFacts } from "@/lib/auth-facts";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a free Stellar account to prepare for the Digital SAT: real-format practice questions, timed practice tests and interactive lessons, with your progress saved on every device.",
};

// Static page: the counts are computed at build time; the form (useSearchParams) renders on the client under Suspense.
export default function Page() {
  return (
    <AuthScreen mode="register" facts={authFacts()}>
      <Suspense
        fallback={
          <AuthPanel title="Create your account">
            <p className="text-sm text-muted">Loading…</p>
          </AuthPanel>
        }
      >
        <StudentSignIn mode="register" />
      </Suspense>
    </AuthScreen>
  );
}
