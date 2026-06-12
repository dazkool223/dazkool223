"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/data";

/**
 * Fixed header: monogram, section index (highlighting whichever section is
 * in view), an explicit console button, a resume download you can't miss,
 * and a full-screen menu on small screens.
 */
export default function Nav() {
  const [time, setTime] = useState("");
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: profile.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector(n.href))
      .filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const openConsole = () =>
    window.dispatchEvent(new CustomEvent("workshop:console"));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between border-b border-line bg-bg/70 px-5 py-4 backdrop-blur-md md:px-10">
        <a href="#top" className="font-mono text-sm font-medium tracking-wider">
          {profile.initials}
          <span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-4 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`label-mono transition-colors hover:text-ink ${
                active === item.href ? "!text-accent" : ""
              }`}
            >
              <span className="opacity-50">{item.index}</span> {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 md:gap-4">
          <span className="label-mono hidden tabular-nums xl:inline">
            {profile.location} <span className="text-accent">{time}</span>
          </span>
          <button
            type="button"
            onClick={openConsole}
            data-cursor
            title="open the console (or press `)"
            className="label-mono border border-line px-3 py-2 !text-ink transition-colors hover:border-accent hover:!text-accent"
          >
            &gt;_ console
          </button>
          <a
            href={profile.resume}
            download="neeraj-kulkarni-python-fullstack.pdf"
            data-cursor
            className="label-mono border border-accent bg-accent px-3 py-2 !text-bg transition-opacity hover:opacity-85"
          >
            resume ↓
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((m) => !m)}
            className="label-mono border border-line px-3 py-2 !text-ink transition-colors hover:border-accent lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "close menu" : "open menu"}
          >
            {menuOpen ? "✕" : "menu"}
          </button>
        </div>
      </header>

      {/* mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[59] flex flex-col justify-center gap-1 bg-bg/95 px-8 pt-16 backdrop-blur-lg lg:hidden">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-4 font-display text-3xl font-medium tracking-tight"
            >
              <span className="mr-4 font-mono text-xs text-accent">
                {item.index}
              </span>
              {item.label}
            </a>
          ))}
          <div className="mt-8 flex flex-wrap gap-6">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openConsole();
              }}
              className="label-mono !text-accent"
            >
              &gt;_ open the console
            </button>
            <a
              href={`mailto:${profile.email}`}
              className="label-mono"
              onClick={() => setMenuOpen(false)}
            >
              email ↗
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="label-mono"
            >
              github ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
}
