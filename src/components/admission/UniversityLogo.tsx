import type { University } from "@/lib/admission";

// A university's logo on a white tile (logos are made for white, in both themes), or a monogram tile when there is no logo file.
// Decorative: the name is always next to it.

export function UniversityLogo({ university, className = "" }: { university: Pick<University, "name" | "abbr" | "logo">; className?: string }) {
  if (university.logo) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-white p-3 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- small local logo file, shown as is */}
        <img src={university.logo} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className={`flex items-center justify-center rounded-xl bg-surface-2 p-3 font-bold tracking-tight text-ink ${className}`}>
      {university.abbr}
    </div>
  );
}
