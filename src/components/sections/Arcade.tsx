"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";

type Bug = { id: number; x: number; y: number; name: string };

const ROUND_SECONDS = 30;
const BUG_LIFETIME_MS = 1400;
const BUG_NAMES = [
  "NullPointerException",
  "off-by-one",
  "race condition",
  "memory leak",
  "CORS error",
  "undefined is not a function",
  "stale cache",
  "infinite loop",
  "merge conflict",
  "flaky test",
];

/**
 * BUG HUNT - bugs spawn on the grid and despawn fast. Squash them before
 * they reach production. Entirely unnecessary; that's the point.
 */
export default function Arcade() {
  const [phase, setPhase] = useState<"idle" | "running" | "over">("idle");
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [score, setScore] = useState(0);
  const [escaped, setEscaped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [best, setBest] = useState(0);
  const nextId = useRef(0);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  // ids already squashed or escaped - keeps scoring idempotent
  const handled = useRef<Set<number>>(new Set());

  useEffect(() => {
    setBest(Number(localStorage.getItem("nk-arcade-best") ?? 0));
    const stash = timers.current;
    return () => stash.forEach(clearInterval);
  }, []);

  const start = () => {
    timers.current.forEach(clearInterval);
    timers.current = [];
    handled.current = new Set();
    setBugs([]);
    setScore(0);
    setEscaped(0);
    setTimeLeft(ROUND_SECONDS);
    setPhase("running");

    const spawner = setInterval(() => {
      const id = nextId.current++;
      const bug: Bug = {
        id,
        x: 6 + Math.random() * 84,
        y: 8 + Math.random() * 78,
        name: BUG_NAMES[Math.floor(Math.random() * BUG_NAMES.length)],
      };
      setBugs((b) => [...b, bug]);
      // a bug not squashed in time has escaped to production
      setTimeout(() => {
        if (handled.current.has(id)) return;
        handled.current.add(id);
        setBugs((b) => b.filter((x) => x.id !== id));
        setEscaped((e) => e + 1);
      }, BUG_LIFETIME_MS);
    }, 650);

    const clock = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          timers.current.forEach(clearInterval);
          timers.current = [];
          setBugs([]);
          setPhase("over");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    timers.current = [spawner, clock];
  };

  // persist best score when a round ends
  useEffect(() => {
    if (phase === "over" && score > best) {
      setBest(score);
      localStorage.setItem("nk-arcade-best", String(score));
    }
  }, [phase, score, best]);

  const squash = (id: number) => {
    if (handled.current.has(id)) return;
    handled.current.add(id);
    setBugs((b) => b.filter((x) => x.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <section
      id="arcade"
      className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40"
    >
      <SectionHeading
        index="08"
        title="arcade"
        note="every workshop needs a break room"
      />

      <Reveal>
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
          <p className="max-w-md text-lg leading-relaxed text-muted">
            <span className="font-mono text-sm text-accent">BUG&nbsp;HUNT</span>{" "}
            - squash the bugs before they reach production. {ROUND_SECONDS}{" "}
            seconds. No sprint planning required.
          </p>
          <div className="flex gap-8 font-mono text-sm tabular-nums">
            <span>
              <span className="text-faint">squashed </span>
              <span className="text-accent">{score}</span>
            </span>
            <span>
              <span className="text-faint">escaped </span>
              <span className="text-ink">{escaped}</span>
            </span>
            <span>
              <span className="text-faint">time </span>
              <span className="text-accent">{timeLeft}s</span>
            </span>
            <span>
              <span className="text-faint">best </span>
              <span className="text-ink">{best}</span>
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div
          className="fig-frame relative h-[420px] select-none overflow-hidden bg-surface/40"
          style={{
            backgroundImage:
              "linear-gradient(var(--line-faint) 1px, transparent 1px), linear-gradient(90deg, var(--line-faint) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        >
          {phase !== "running" && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-bg/60 backdrop-blur-[2px]">
              {phase === "over" && (
                <div className="text-center font-mono text-sm">
                  <p className="mb-2 text-2xl text-ink">
                    {score} squashed · {escaped} escaped
                  </p>
                  <p className="text-muted">
                    {escaped === 0
                      ? "a clean release. suspicious."
                      : score > escaped
                        ? "shipped it anyway. that's engineering."
                        : "QA would like a word."}
                  </p>
                </div>
              )}
              <Magnetic>
                <button
                  type="button"
                  onClick={start}
                  data-cursor
                  className="border border-accent px-8 py-4 font-mono text-sm tracking-wider text-ink transition-colors duration-300 hover:bg-accent hover:text-bg"
                >
                  {phase === "idle" ? "▶ start the hunt" : "↻ hunt again"}
                </button>
              </Magnetic>
            </div>
          )}

          {bugs.map((bug) => (
            <button
              key={bug.id}
              type="button"
              onPointerDown={() => squash(bug.id)}
              aria-label={`squash ${bug.name}`}
              className="bug group absolute z-0 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-bg font-mono text-base text-accent transition-transform group-hover:scale-110">
                ✱
              </span>
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] text-faint">
                {bug.name}
              </span>
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="annotation mt-6 text-right">
          built in react state and questionable priorities
        </p>
      </Reveal>
    </section>
  );
}
