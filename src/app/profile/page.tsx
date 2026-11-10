import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/ProfileForm";

export const metadata: Metadata = { title: "Profile" };

export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:py-14">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Profile</h1>
      <p className="mt-2 mb-8 text-muted">Choose how you appear on Stellar.</p>
      <ProfileForm />
    </section>
  );
}
