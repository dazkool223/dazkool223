"use client";

import { useEffect, useState } from "react";

/**
 * Press "g" anywhere to toggle the layout grid - the kind designers leave
 * on while building. Also drops a note in the console for the curious.
 */
export default function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log(
      "%c┌─────────────────────────────────────┐\n" +
        "│  you opened the console. respect.   │\n" +
        "│  this site is a lab notebook -      │\n" +
        "│  press “g” to see its skeleton.     │\n" +
        "└─────────────────────────────────────┘",
      "color:#ff5c1c; font-family:monospace; font-size:12px;",
    );

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key.toLowerCase() === "g" && !e.metaKey && !e.ctrlKey) {
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] mx-auto grid max-w-7xl grid-cols-4 gap-4 px-6 md:grid-cols-12 md:px-10">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className={`h-full bg-accent/[0.06] outline outline-1 outline-accent/20 ${
            i >= 4 ? "hidden md:block" : ""
          }`}
        />
      ))}
    </div>
  );
}
