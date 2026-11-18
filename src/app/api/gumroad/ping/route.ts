import { handleGumroadRequest } from "@/lib/payments-server";

// Gumroad's webhook (POST only; other methods get a 405 from Next). Two senders:
//   - the seller's Ping (sales), signed with X-Gumroad-Signature;
//   - API resource subscriptions (refund, dispute, cancellation, …), unsigned, called with ?key=<GUMROAD_WEBHOOK_KEY>.
// 200 = handled or deliberately ignored, 401 = not from Gumroad, 500 = Gumroad retries. Rules: lib/payments-server.ts.

export async function POST(request: Request) {
  return handleGumroadRequest(request);
}
