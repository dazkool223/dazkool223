"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const BOOT_LINES = [
  "mounting workshop…",
  "calibrating grid…",
  "indexing field notes…",
  "warming up particles…",
];

/**
 * A short boot sequence - counter to 100, a few log lines, then the
 * shutter lifts. Fires "workshop:ready" so the hero knows when to enter.
 */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        window.dispatchEvent(new CustomEvent("workshop:ready"));
        setDone(true);
        return;
      }

      const counter = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => setDone(true),
      });

      tl.from(".boot-line", {
        opacity: 0,
        y: 8,
        stagger: 0.22,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          counter,
          {
            value: 100,
            duration: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(counter.value)
                ).padStart(3, "0");
              }
            },
          },
          0
        )
        .to(ref.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
          delay: 0.15,
          // the hero starts entering while the shutter lifts
          onStart: () => window.dispatchEvent(new CustomEvent("workshop:ready")),
        });
    },
    { scope: ref }
  );

  if (done) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[80] flex flex-col justify-between bg-bg p-6 md:p-10"
    >
      <div className="label-mono">nk - digital workshop</div>
      <div className="flex flex-col gap-1 font-mono text-xs text-muted">
        {BOOT_LINES.map((line) => (
          <span key={line} className="boot-line">
            <span className="text-accent">&gt;</span> {line}
          </span>
        ))}
      </div>
      <div className="flex items-end justify-between">
        <span className="label-mono">est. 2024 · pune, in</span>
        <span
          ref={counterRef}
          className="font-mono text-6xl font-medium text-ink md:text-8xl"
        >
          000
        </span>
      </div>
    </div>
  );
}
