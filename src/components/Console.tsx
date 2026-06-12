"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  profile,
  nav,
  toolbench,
  toolGroups,
  experiments,
  worklog,
  studio,
} from "@/lib/data";
import { themes, applyTheme, currentTheme } from "@/lib/themes";

export type ArticleMeta = { slug: string; title: string; date: string };

type Line = { kind: "cmd" | "out" | "accent" | "err"; text: string };

type Bug = { id: number; x: number; y: number; name: string };
type Game = { bugs: Bug[]; score: number; escaped: number; timeLeft: number };

const ROUND_SECONDS = 25;
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

const BANNER: Line[] = [
  { kind: "accent", text: "+--------------------------------------+" },
  { kind: "accent", text: "|   nk @ workshop  ::  console  v2.0   |" },
  { kind: "accent", text: "+--------------------------------------+" },
  { kind: "out", text: "type 'help' to see what this thing does." },
  { kind: "out", text: "try 'theme list' to repaint the workshop," },
  { kind: "out", text: "or 'hunt' to play the arcade." },
  { kind: "out", text: "" },
];

const VIOLIN = String.raw`
        ____
       (    )
        |  |
        |  |
     .-'    '-.
    /  ()  ()  \
    |    ||    |
    \   ====   /
     '-.____.-'
`;

const PROMPT = "guest@workshop:~$";

/**
 * The workshop console, stripe.dev style: backtick (or the console button
 * in the nav) slides a terminal up from the bottom. Every command is wired
 * to the site's real content. Also home to the arcade (`hunt`) and the
 * theme switcher (`theme list`).
 */
export default function Console({ articles }: { articles: ArticleMeta[] }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [game, setGame] = useState<Game | null>(null);
  const gameRef = useRef<Game | null>(null);
  gameRef.current = game;

  const history = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  const handled = useRef<Set<number>>(new Set());
  const nextBugId = useRef(0);

  const print = (...newLines: Line[]) =>
    setLines((prev) => [...prev, ...newLines]);

  const out = (text: string): Line => ({ kind: "out", text });
  const accent = (text: string): Line => ({ kind: "accent", text });
  const err = (text: string): Line => ({ kind: "err", text });

  // ---------- BUG HUNT ----------

  const stopTimers = () => {
    timers.current.forEach(clearInterval);
    timers.current = [];
  };

  const endGame = useCallback((aborted: boolean) => {
    const g = gameRef.current;
    stopTimers();
    setGame(null);
    if (!g) return;

    let best = 0;
    try {
      best = Number(localStorage.getItem("nk-arcade-best") ?? 0);
      if (g.score > best) {
        best = g.score;
        localStorage.setItem("nk-arcade-best", String(best));
      }
    } catch {
      /* storage unavailable */
    }

    setLines((prev) => [
      ...prev,
      { kind: "accent", text: aborted ? "hunt aborted." : "round over." },
      {
        kind: "out",
        text: `  squashed ${g.score} · escaped ${g.escaped} · best ${best}`,
      },
      {
        kind: "out",
        text: aborted
          ? "  the bugs win by forfeit."
          : g.escaped === 0
            ? "  a clean release. suspicious."
            : g.score > g.escaped
              ? "  shipped it anyway. that's engineering."
              : "  QA would like a word.",
      },
      { kind: "out", text: "" },
    ]);
    inputRef.current?.focus();
  }, []);

  const startGame = useCallback(() => {
    stopTimers();
    handled.current = new Set();
    setGame({ bugs: [], score: 0, escaped: 0, timeLeft: ROUND_SECONDS });

    const spawner = setInterval(() => {
      const id = nextBugId.current++;
      setGame(
        (g) =>
          g && {
            ...g,
            bugs: [
              ...g.bugs,
              {
                id,
                x: 6 + Math.random() * 88,
                y: 16 + Math.random() * 68,
                name: BUG_NAMES[Math.floor(Math.random() * BUG_NAMES.length)],
              },
            ],
          }
      );
      // a bug not squashed in time escapes to production
      setTimeout(() => {
        if (handled.current.has(id)) return;
        handled.current.add(id);
        setGame(
          (g) =>
            g && {
              ...g,
              bugs: g.bugs.filter((b) => b.id !== id),
              escaped: g.escaped + 1,
            }
        );
      }, BUG_LIFETIME_MS);
    }, 650);

    const clock = setInterval(() => {
      setGame((g) => {
        if (!g) return g;
        if (g.timeLeft <= 1) {
          setTimeout(() => endGame(false), 0);
          return { ...g, timeLeft: 0, bugs: [] };
        }
        return { ...g, timeLeft: g.timeLeft - 1 };
      });
    }, 1000);

    timers.current = [spawner, clock];
  }, [endGame]);

  const squashBug = (id: number) => {
    if (handled.current.has(id)) return;
    handled.current.add(id);
    setGame(
      (g) =>
        g && {
          ...g,
          bugs: g.bugs.filter((b) => b.id !== id),
          score: g.score + 1,
        }
    );
  };

  // abort the round if the console closes mid-hunt; clean up on unmount
  useEffect(() => {
    if (!open && gameRef.current) endGame(true);
  }, [open, endGame]);
  useEffect(() => stopTimers, []);

  // ---------- commands ----------

  const goto = useCallback((href: string) => {
    setOpen(false);
    setTimeout(() => {
      if (window.__lenis) window.__lenis.scrollTo(href, { offset: -64 });
      else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim();
      const [cmd, ...rest] = input.split(/\s+/);
      const arg = rest.join(" ").toLowerCase();

      switch (cmd.toLowerCase()) {
        case "":
          return;

        case "help":
          print(
            accent("the workshop accepts:"),
            out("  help            this list"),
            out("  whoami          who's behind the workshop"),
            out("  ls              list the sections"),
            out("  open <name>     jump to a section, e.g. open studio"),
            out("  theme <name>    repaint the site ('theme list' first)"),
            out("  hunt            play BUG HUNT, the workshop arcade"),
            out("  skills          the toolbench, grouped"),
            out("  projects        current experiments"),
            out("  worklog         where i've worked"),
            out("  treks           the trail log"),
            out("  articles        journal entries"),
            out("  resume          download the python fullstack resume"),
            out("  email           open a mail draft"),
            out("  socials         github / linkedin"),
            out("  violin          play me something"),
            out("  grid            toggle the layout grid"),
            out("  clear           wipe the scrollback"),
            out("  exit            close the console"),
            out("")
          );
          return;

        case "theme":
        case "themes": {
          if (!arg || arg === "list" || arg === "ls") {
            const active = currentTheme();
            print(accent("themes - 'theme <name>' to apply:"));
            for (const [name, t] of Object.entries(themes)) {
              print(
                out(
                  `  ${name === active ? ">" : " "} ${name.padEnd(11)}${t.hint}`
                )
              );
            }
            print(out(""));
            return;
          }
          const name = arg === "reset" || arg === "default" ? "workshop" : arg;
          if (applyTheme(name)) {
            print(accent(`theme applied: ${name}`), out(""));
          } else {
            print(err(`no theme named '${arg}' - try 'theme list'`), out(""));
          }
          return;
        }

        case "hunt":
        case "arcade":
        case "play":
          print(
            accent("BUG HUNT - squash them before they ship."),
            out(`${ROUND_SECONDS} seconds on the clock. go.`)
          );
          startGame();
          return;

        case "whoami":
          print(
            out(
              `${profile.name.toLowerCase()} - ${profile.role.toLowerCase()} @ ${profile.org.toLowerCase()}`
            ),
            out("builds to understand. also: violin, graphite, mountains."),
            out("")
          );
          return;

        case "ls":
        case "sections":
          print(
            ...nav.map((n) =>
              out(`  ${n.index}  ${n.label.padEnd(13)} ${n.href}`)
            ),
            out("")
          );
          return;

        case "open":
        case "goto":
        case "cd": {
          if (!arg) {
            print(err("usage: open <section> - try 'ls' first"), out(""));
            return;
          }
          const target = nav.find(
            (n) =>
              n.label.toLowerCase().includes(arg) ||
              n.href.replace("#", "").includes(arg)
          );
          if (!target) {
            print(err(`no section matching '${arg}' - try 'ls'`), out(""));
            return;
          }
          print(accent(`opening ${target.label}...`));
          goto(target.href);
          return;
        }

        case "skills":
        case "stack":
        case "toolbench":
          for (const group of toolGroups) {
            print(
              accent(`  ${group.label.toLowerCase()}`),
              out(
                "    " +
                  toolbench
                    .filter((t) => t.group === group.id)
                    .map((t) => t.name)
                    .join(" · ")
              )
            );
          }
          print(out(""));
          return;

        case "projects":
        case "experiments":
          print(
            ...experiments.flatMap((e) => [
              accent(`  ${e.fig}  ${e.name}  [${e.status}]`),
              out(`        ${e.tagline.toLowerCase()}`),
            ]),
            out("")
          );
          return;

        case "worklog":
        case "experience":
          print(
            ...worklog.flatMap((w) => [
              accent(`  ${w.period}`),
              out(`        ${w.role} - ${w.org}`),
            ]),
            out("")
          );
          return;

        case "treks":
        case "mountains":
          print(
            ...studio.treks.map((t) =>
              out(`  ^ ${t.elevation.padEnd(10)} ${t.name}, ${t.region}`)
            ),
            out("")
          );
          return;

        case "articles":
        case "journal":
        case "blog":
          if (articles.length === 0) {
            print(
              out("the journal is empty. suspiciously well-rested."),
              out("")
            );
            return;
          }
          print(
            ...articles.map((a) =>
              out(`  ${a.date}  ${a.title}  -> /journal/${a.slug}`)
            ),
            accent("  (or run: open studio - the journal lives there)"),
            out("")
          );
          return;

        case "resume":
        case "cv": {
          const a = document.createElement("a");
          a.href = profile.resume;
          a.download = "neeraj-kulkarni-python-fullstack.pdf";
          a.click();
          print(
            accent("downloading resume.pdf (python fullstack edition)..."),
            out("the site is the longer version."),
            out("")
          );
          return;
        }

        case "email":
        case "contact":
          window.location.href = `mailto:${profile.email}`;
          print(accent(`drafting mail to ${profile.email}...`), out(""));
          return;

        case "socials":
        case "links":
          print(
            out(`  github    ${profile.github}`),
            out(`  linkedin  ${profile.linkedin}`),
            out("")
          );
          return;

        case "violin":
          print(
            ...VIOLIN.split("\n").map((l) => accent(l)),
            out(
              "(close enough. the real one is in the studio - try 'open studio')"
            ),
            out("")
          );
          return;

        case "grid":
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "g" }));
          print(accent("layout grid toggled."), out(""));
          return;

        case "clear":
        case "cls":
          setLines([]);
          return;

        case "exit":
        case "quit":
        case "q":
          setOpen(false);
          return;

        case "pwd":
          print(out("/home/neeraj/workshop"), out(""));
          return;

        case "date":
          print(out(new Date().toString()), out(""));
          return;

        case "echo":
          print(out(rest.join(" ")), out(""));
          return;

        case "sudo":
          print(
            err("nice try. this incident will be reported to the rubber duck."),
            out("")
          );
          return;

        case "rm":
          print(
            err("permission denied: the workshop took too long to build."),
            out("")
          );
          return;

        case "hello":
        case "hi":
        case "hey":
          print(out("hey! you found the console. you'd like it here."), out(""));
          return;

        case "coffee":
        case "chai":
          print(accent("brewing... done. productivity +12%."), out(""));
          return;

        default:
          print(err(`command not found: ${cmd}`), out("try 'help'"), out(""));
      }
    },
    [articles, goto, startGame]
  );

  // global shortcuts: backtick toggles, Esc closes (or aborts the hunt)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (e.key === "`" && !typing && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        if (gameRef.current) endGame(true);
        else setOpen(false);
      }
    };
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener("keydown", onKey);
    window.addEventListener("workshop:console", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("workshop:console", onToggle);
    };
  }, [endGame]);

  // focus on open, autoscroll on output
  useEffect(() => {
    if (open && !game) inputRef.current?.focus();
  }, [open, game]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    print({ kind: "cmd", text: value });
    if (value.trim()) {
      history.current.push(value);
      histIdx.current = history.current.length;
    }
    run(value);
    setValue("");
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx.current > 0) {
        histIdx.current -= 1;
        setValue(history.current[histIdx.current] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx.current < history.current.length - 1) {
        histIdx.current += 1;
        setValue(history.current[histIdx.current] ?? "");
      } else {
        histIdx.current = history.current.length;
        setValue("");
      }
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[70] transition-transform duration-300 ease-out ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
      role="dialog"
      aria-label="workshop console"
      aria-hidden={!open}
    >
      <div className="mx-auto max-w-4xl border border-line border-b-0 bg-bg/95 shadow-[0_-24px_64px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md">
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full bg-accent/80" />
              <i className="h-2.5 w-2.5 rounded-full border border-line" />
              <i className="h-2.5 w-2.5 rounded-full border border-line" />
            </span>
            <span className="label-mono">
              nk@workshop: {game ? "~/arcade" : "~"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => (game ? endGame(true) : setOpen(false))}
            className="label-mono transition-colors hover:text-accent"
            aria-label={game ? "quit the hunt" : "close console"}
          >
            esc ✕
          </button>
        </div>

        {game ? (
          /* ---------- BUG HUNT field ---------- */
          <div
            className="relative h-[50vh] select-none overflow-hidden md:h-[42vh]"
            style={{
              backgroundImage:
                "linear-gradient(var(--line-faint) 1px, transparent 1px), linear-gradient(90deg, var(--line-faint) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-2 font-mono text-xs tabular-nums">
              <span>
                <span className="text-faint">squashed </span>
                <span className="text-accent">{game.score}</span>
                <span className="ml-4 text-faint">escaped </span>
                <span className="text-ink">{game.escaped}</span>
              </span>
              <span className="text-accent">{game.timeLeft}s</span>
            </div>

            {game.bugs.map((bug) => (
              <button
                key={bug.id}
                type="button"
                onPointerDown={() => squashBug(bug.id)}
                aria-label={`squash ${bug.name}`}
                className="bug group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-bg font-mono text-base text-accent transition-transform group-hover:scale-110">
                  ✱
                </span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] text-faint">
                  {bug.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          /* ---------- scrollback + prompt ---------- */
          <div
            ref={scrollRef}
            data-lenis-prevent
            className="h-[50vh] overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed md:h-[42vh]"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap ${
                  line.kind === "cmd"
                    ? "text-ink"
                    : line.kind === "accent"
                      ? "text-accent"
                      : line.kind === "err"
                        ? "italic text-accent/80"
                        : "text-muted"
                }`}
              >
                {line.kind === "cmd" ? (
                  <>
                    <span className="text-faint">{PROMPT} </span>
                    {line.text}
                  </>
                ) : (
                  line.text || " "
                )}
              </div>
            ))}

            {/* prompt */}
            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <span className="shrink-0 text-faint">{PROMPT}</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onInputKey}
                className="w-full bg-transparent text-base text-ink caret-accent outline-none md:text-[13px]"
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="console input"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
