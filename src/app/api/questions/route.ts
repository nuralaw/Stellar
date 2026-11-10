import type { NextRequest } from "next/server";
import { getQuestionsByIds, sampleQuestions } from "@/lib/bank";
import { DOMAINS } from "@/lib/taxonomy";
import type { Difficulty } from "@/lib/types";

// GET /api/questions?ids=rw-0001,m-0002                → those questions, in order (max 50)
// GET /api/questions?section=rw|math&domain=&skill=&difficulty=&limit=10&exclude=id1,id2   → random sample
export function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;

  const ids = p.get("ids");
  if (ids) {
    const questions = getQuestionsByIds(ids.split(",").filter(Boolean).slice(0, 50));
    return Response.json({ questions }, { headers: { "Cache-Control": "no-store" } });
  }

  const section = p.get("section") === "math" ? "math" : "rw";
  const dom = DOMAINS.find((x) => x.id === p.get("domain") && x.section === section);
  const domain = dom?.id ?? "all";
  const skill = dom?.skills.some((s) => s.id === p.get("skill")) ? p.get("skill")! : "all";
  const diff = p.get("difficulty");
  const difficulty: Difficulty | "all" = diff === "easy" || diff === "medium" || diff === "hard" ? diff : "all";
  const limit = Math.min(Math.max(Number(p.get("limit")) || 10, 1), 50);
  const exclude = new Set((p.get("exclude") ?? "").split(",").filter(Boolean).slice(0, 5000));

  const questions = sampleQuestions({ section, domain, skill, difficulty, limit, exclude });
  return Response.json({ questions }, { headers: { "Cache-Control": "no-store" } });
}
