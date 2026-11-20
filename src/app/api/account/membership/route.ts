import { NO_STORE, currentUser } from "@/lib/admin";
import { membershipFor } from "@/lib/membership-server";

// GET → { membership: { status, endsAt, manageUrl } | null } for the signed-in student's Monthly membership (shown on /profile).
// Only those three fields leave the server. null = no membership, or it has ended. Any failure also answers null: it never breaks /profile.

export async function GET() {
  const user = await currentUser();
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401, headers: NO_STORE });
  try {
    const m = await membershipFor(user.id);
    // An old membership whose state can't be read is not shown at all.
    const staleUnknown = m?.status === "unknown" && Date.now() - Date.parse(m.lastChargeAt) > 40 * 24 * 60 * 60 * 1000;
    const membership = m && m.status !== "ended" && !staleUnknown ? { status: m.status, endsAt: m.endsAt, manageUrl: m.manageUrl } : null;
    return Response.json({ membership }, { headers: NO_STORE });
  } catch {
    return Response.json({ membership: null }, { headers: NO_STORE });
  }
}
