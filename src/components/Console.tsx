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

export type ArticleMeta = { slug: string; title: string; date: string };

type Line = { kind: "cmd" | "out" | "accent" | "err"; text: string };

const BANNER: Line[] = [
  { kind: "accent", text: "+--------------------------------------+" },
  { kind: "accent", text: "|   nk @ workshop  ::  console  v1.0   |" },
  { kind: "accent", text: "+--------------------------------------+" },
  { kind: "out", text: "type 'help' to see what this thing does." },
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
 * The workshop console, stripe.dev style: backtick (or the >_ button in the
 * nav) slides a terminal up from the bottom. Every command is wired to the
 * site's real content.
 */
export default function Console({ articles }: { articles: ArticleMeta[] }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const histIdx = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const print = (...newLines: Line[]) =>
    setLines((prev) => [...prev, ...newLines]);

  const out = (text: string): Line => ({ kind: "out", text });
  const accent = (text: string): Line => ({ kind: "accent", text });
  const err = (text: string): Line => ({ kind: "err", text });

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

        case "whoami":
          print(
            out(`${profile.name.toLowerCase()} - ${profile.role.toLowerCase()} @ ${profile.org.toLowerCase()}`),
            out("builds to understand. also: violin, graphite, mountains."),
            out("")
          );
          return;

        case "ls":
        case "sections":
          print(
            ...nav.map((n) => out(`  ${n.index}  ${n.label.padEnd(12)} ${n.href}`)),
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
            print(out("the journal is empty. suspiciously well-rested."), out(""));
            return;
          }
          print(
            ...articles.map((a) =>
              out(`  ${a.date}  ${a.title}  -> /journal/${a.slug}`)
            ),
            accent("  (or run: open journal)"),
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
        case "play":
          print(
            ...VIOLIN.split("\n").map((l) => accent(l)),
            out("(close enough. the real one is in the studio - try 'open studio')"),
            out("")
          );
          return;

        case "grid":
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "g" }));
          print(accent("layout grid toggled."), out(""));
          return;

        case "hunt":
        case "arcade":
          print(accent("loading the break room..."));
          goto("#arcade");
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
          print(
            err(`command not found: ${cmd}`),
            out("try 'help'"),
            out("")
          );
      }
    },
    [articles, goto]
  );

  // global shortcuts: backtick toggles, Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA";
      if (e.key === "`" && !typing && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener("keydown", onKey);
    window.addEventListener("workshop:console", onToggle);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("workshop:console", onToggle);
    };
  }, []);

  // focus on open, autoscroll on output
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
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
            <span className="label-mono">nk@workshop: ~</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="label-mono transition-colors hover:text-accent"
            aria-label="close console"
          >
            esc ✕
          </button>
        </div>

        {/* scrollback */}
        <div
          ref={scrollRef}
          data-lenis-prevent
          className="h-[42vh] overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed"
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
                      ? "text-accent/80 italic"
                      : "text-muted"
              }`}
            >
              {line.kind === "cmd" ? (
                <>
                  <span className="text-faint">{PROMPT} </span>
                  {line.text}
                </>
              ) : (
                line.text || " "
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
              className="w-full bg-transparent text-ink caret-accent outline-none"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label="console input"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
