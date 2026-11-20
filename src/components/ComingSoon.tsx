import Link from "next/link";
import { LogoMark } from "./Logo";

export function ComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="flex justify-center">
        <LogoMark className="h-14" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-3 text-muted">{body}</p>
      <p className="mt-6 inline-block rounded-full bg-accent-soft px-3 py-1 text-sm font-medium">Coming soon</p>
      <div className="mt-8">
        <Link href="/" className="text-sm font-medium text-primary-strong hover:underline">
          ← Back to home
        </Link>
      </div>
    </section>
  );
}
