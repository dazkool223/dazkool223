"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/data";

/**
 * Fixed header: monogram, section index (highlighting whichever section is
 * in view), and a live local clock for the workshop's timezone.
 */
export default function Nav() {
  const [time, setTime] = useState("");
  const [active, setActive] = useState("");

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

  return (
    <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between border-b border-line bg-bg/70 px-6 py-4 backdrop-blur-md md:px-10">
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

      <div className="flex items-center gap-3 md:gap-5">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("workshop:console"))}
          data-cursor
          title="open the console (or press `)"
          className="label-mono border border-line px-3 py-1.5 !text-ink transition-colors hover:border-accent hover:!text-accent"
        >
          &gt;_
        </button>
        <a
          href={profile.resume}
          download="neeraj-kulkarni-python-fullstack.pdf"
          data-cursor
          className="label-mono border border-line px-3 py-1.5 !text-ink transition-colors hover:border-accent hover:!text-accent"
        >
          cv ↓
        </a>
        <span className="label-mono hidden tabular-nums sm:inline">
          {profile.location} <span className="text-accent">{time}</span>
        </span>
      </div>
    </header>
  );
}
