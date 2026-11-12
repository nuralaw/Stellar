import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return <ComingSoon title="Sign in" body="Create an account to save your progress across devices." />;
}
