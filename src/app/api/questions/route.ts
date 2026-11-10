import type { NextRequest } from "next/server";
import { sampleQuestions } from "@/lib/bank";
import { DOMAINS } from "@/lib/taxonomy";
import type { Difficulty } from "@/lib/types";

// GET /api/questions?section=rw|math&domain=<id>|all&difficulty=easy|medium|hard|all&limit=10&exclude=id1,id2
export function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const section = p.get("section") === "math" ? "math" : "rw";
  const d = p.get("domain") ?? "all";
  const domain = DOMAINS.some((x) => x.id === d && x.section === section) ? d : "all";
  const diff = p.get("difficulty");
  const difficulty: Difficulty | "all" = diff === "easy" || diff === "medium" || diff === "hard" ? diff : "all";
  const limit = Math.min(Math.max(Number(p.get("limit")) || 10, 1), 50);
  const exclude = new Set((p.get("exclude") ?? "").split(",").filter(Boolean).slice(0, 5000));

  const questions = sampleQuestions({ section, domain, difficulty, limit, exclude });
  return Response.json({ questions }, { headers: { "Cache-Control": "no-store" } });
}
