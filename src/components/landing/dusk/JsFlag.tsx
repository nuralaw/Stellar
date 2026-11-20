"use client";

import { InlineScript } from "@/components/InlineScript";

// Runs before first paint on a full page load: marks the page as "JS on" so the scroll animations and the dock apply (no-JS
// visitors get the plain page). A Client Component on purpose: InlineScript decides its script type by environment, and
// inside a Server Component that choice would be frozen as executable and React would warn when the page renders on the
// client (client-side navigation). DuskBehavior sets the same flag in that case.
export function JsFlag() {
  return <InlineScript html={`document.documentElement.setAttribute("data-dusk-js","")`} />;
}
