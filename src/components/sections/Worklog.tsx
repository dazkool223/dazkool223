"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { worklog } from "@/lib/data";

export default function Worklog() {
  const ref = useRef<HTMLElement>(null);

  // the spine of the timeline draws itself as you scroll past
  useGSAP(
    () => {
      gsap.from(".worklog-spine", {
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: ".worklog-entries",
          start: "top 75%",
          end: "bottom 60%",
          scrub: 1,
        },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="worklog"
      className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40"
    >
      <SectionHeading
        index="02"
        title="worklog"
        note="commits to the real world"
      />

      <div className="worklog-entries relative">
        <div className="worklog-spine absolute bottom-0 left-0 top-0 hidden w-px bg-accent md:block" />

        {worklog.map((entry, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <article className="grid gap-4 border-t border-line py-12 md:grid-cols-12 md:gap-8 md:pl-10">
              <div className="md:col-span-3">
                <p className="font-mono text-xs tracking-[0.18em] text-accent">
                  {entry.period}
                </p>
              </div>
              <div className="md:col-span-5">
                <h3 className="font-display text-2xl font-medium md:text-3xl">
                  {entry.role}
                </h3>
                <p className="mt-1 text-muted">{entry.org}</p>
                {entry.stack && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.stack.map((s) => (
                      <span
                        key={s}
                        className="border border-line px-2.5 py-1 font-mono text-[11px] text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ul className="flex flex-col gap-3 md:col-span-4">
                {entry.notes.map((note, j) => (
                  <li
                    key={j}
                    className="text-sm leading-relaxed text-muted md:text-base"
                  >
                    <span className="mr-2 text-accent">-</span>
                    {note}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
        <div className="rule" />
      </div>
    </section>
  );
}
