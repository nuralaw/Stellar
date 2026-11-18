import type { ReactNode } from "react";
import type { AuthFacts } from "@/lib/auth-facts";
import { AuthTabs } from "./AuthTabs";
import { AccountView, FeaturesView, PricingView } from "./auth-views";

// Layout of /register and /login: a sidebar (like the app's) with three tabs (the form, Features, Pricing) and the
// matching panel next to it (see AuthTabs.tsx). The layout hides the app sidebar on these pages (components/AppShell.tsx).

export function AuthScreen({ mode, facts, children }: { mode: "register" | "signin"; facts: AuthFacts; children: ReactNode }) {
  return <AuthTabs mode={mode} account={<AccountView mode={mode} facts={facts}>{children}</AccountView>} features={<FeaturesView facts={facts} />} pricing={<PricingView mode={mode} facts={facts} />} />;
}
