"use client";

import Link from "next/link";
import { BTN_PRIMARY } from "@/components/plus/styles";
import { useAuth } from "@/lib/auth-client";
import { CARD } from "./styles";

/**
 * The call to action at the end of a public resource page. Server HTML and signed-out visitors get "Create a free account";
 * once the browser knows a student is signed in, the button points into the app instead (no skeleton: the signed-out version
 * has to be in the HTML for search engines).
 */
export function ResourceCta({ text, href, label }: { text: string; href: string; label: string }) {
  const auth = useAuth();
  const member = auth.ready && auth.user !== null;
  return (
    <div className={`${CARD} mt-12 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 md:mt-16`}>
      <p className="max-w-xl text-lg font-semibold text-balance">{text}</p>
      <Link href={member ? href : "/register"} className={`${BTN_PRIMARY} shrink-0 self-start sm:self-auto`}>
        {member ? label : "Create a free account"}
      </Link>
    </div>
  );
}
