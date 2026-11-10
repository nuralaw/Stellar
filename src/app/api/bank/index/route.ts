import { getIndex } from "@/lib/bank";

// GET /api/bank/index — compact list of all live questions: [id, domain, skill, e|m|h, preview][]
// Static: prerendered at build time.
export function GET() {
  return Response.json(getIndex());
}
