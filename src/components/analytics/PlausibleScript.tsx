import Script from "next/script";
import { PLAUSIBLE_DOMAIN, PLAUSIBLE_EVENT_PATH, PLAUSIBLE_SCRIPT_PATH } from "@/lib/analytics";

// Plausible Analytics, loaded through our own domain (next.config.ts rewrites) so ad blockers don't drop it.
// Off (renders nothing, no requests) while NEXT_PUBLIC_PLAUSIBLE_DOMAIN is empty. Mount once in the root layout.
// Server component: no hooks or event handlers, so it adds no client JS of its own.
//
// Snippet = Plausible's current one (2025+): site-specific script (/js/pa-XXXX.js, proxied) + queue stub +
// plausible.init({ endpoint }). It also carries data-domain / data-api, which the older /js/script.js reads,
// so the default script (NEXT_PUBLIC_PLAUSIBLE_SCRIPT unset) works too.
// Client-side (App Router) navigations: the script patches history.pushState and counts each route change
// itself, so no route listener is needed. Localhost isn't counted (Plausible's captureOnLocalhost: false).
//
// Not counted:
// - the owner: browsers with the `stellar:admin` flag (src/lib/admin-flag.ts). Mirrored into
//   localStorage.plausible_ignore = "true" on each page load (honoured by every Plausible script; we only remove
//   it again if we set it), plus a live check in transformRequest so a fresh admin sign-in stops counting at once.
// - /admin pages, via transformRequest (site-specific script only; the old script would count them).

const INIT = `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
(function(){
var A="stellar:admin",M="stellar:plausible-ignore",I="plausible_ignore";
function admin(){try{return localStorage.getItem(A)==="1"}catch(e){return false}}
try{if(admin()){localStorage.setItem(I,"true");localStorage.setItem(M,"1")}else if(localStorage.getItem(M)==="1"){localStorage.removeItem(I);localStorage.removeItem(M)}}catch(e){}
plausible.init({endpoint:${JSON.stringify(PLAUSIBLE_EVENT_PATH)},transformRequest:function(r){return admin()||/^\\/admin(\\/|$)/.test(location.pathname)?null:r}});
})();`;

export function PlausibleScript() {
  if (!PLAUSIBLE_DOMAIN) return null;
  return (
    <>
      <Script id="plausible-init" strategy="afterInteractive">
        {INIT}
      </Script>
      <Script id="plausible" src={PLAUSIBLE_SCRIPT_PATH} strategy="afterInteractive" data-domain={PLAUSIBLE_DOMAIN} data-api={PLAUSIBLE_EVENT_PATH} />
    </>
  );
}
