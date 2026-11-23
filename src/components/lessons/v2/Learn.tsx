"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { I, Icon } from "@/components/bank/icons";
import type { Subtopic } from "@/lib/lesson-format";
import { DesmosDemo } from "../DesmosDemo";
import { Example } from "../Example";
import { inline, Markdown } from "../Markdown";
import { Stage } from "../visuals/Stage";
import { btnSoft, LessonIsland, NavArrows, Pane, PopIsland, TIGHT } from "./Shell";

/**
 * The Learn screen of a subtopic, all on one page: the animation in its own island on the left, the key ideas on the
 * right, and under them "Not sure?", which opens the theory island right below it.
 */
export function LearnScreen({ subtopic, visual, onBack, onNext, nextLabel }: { subtopic: Subtopic; visual: ReactNode; onBack: () => void; onNext: () => void; nextLabel?: string }) {
  const [theory, setTheory] = useState(false);
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const { example, desmos } = subtopic;

  return (
    <LessonIsland
      left={
        <div className="overflow-hidden rounded-2xl bg-surface-2/50 ring-1 ring-line">
          {visual ? <Stage className="aspect-[16/9] w-full p-[3%]">{visual}</Stage> : <p className="p-6 text-sm text-muted">Animation not found: {subtopic.visual}</p>}
        </div>
      }
      main={
        <Pane label="Lesson text">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{inline(subtopic.title)}</h1>
          {subtopic.tagline && <p className="mt-1.5 text-base leading-snug text-muted">{inline(subtopic.tagline)}</p>}

          <div className="mt-5 text-[17px] [&>div]:text-[17px] [&>div>*:first-child]:mt-0 [&>div>*:last-child]:mb-0">
            <Markdown source={subtopic.keyIdeas} />
          </div>

          {example && <Example prompt={example.prompt} choices={example.choices} lines={example.lines} shown={example.lines.length} />}
          {desmos && (
            <div className="mt-6">
              <DesmosDemo moves={desmos.moves} prompt={desmos.prompt || undefined} label="Watch it in Desmos" />
            </div>
          )}

          {subtopic.theory && (
            <div className="mt-6">
              <button ref={button} type="button" onClick={() => setTheory((v) => !v)} aria-expanded={theory} aria-controls={id} className={btnSoft}>
                Not sure?
                <Icon d={I.chevronD} className={`h-4 w-4 transition-transform duration-300 motion-reduce:transition-none ${theory ? "rotate-180" : ""}`} strokeWidth={2.2} />
              </button>
              <PopIsland id={id} open={theory} title="Theory" onClose={() => setTheory(false)} returnTo={button}>
                <div className={`text-[15px] ${TIGHT}`}>
                  <Markdown source={subtopic.theory} />
                </div>
              </PopIsland>
            </div>
          )}
        </Pane>
      }
      nav={<NavArrows onBack={onBack} onNext={onNext} nextLabel={nextLabel} primary />}
    />
  );
}
