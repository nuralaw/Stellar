import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/admin/ForgotPassword";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

export default function Page() {
  return <ForgotPasswordForm />;
}
