"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { fieldNotes, sectionTotal } from "@/lib/data";

/**
 * The digital-garden shelf: index cards in a horizontal track. On desktop
 * the section pins and vertical scroll drives the cards sideways; on
 * mobile it's a plain swipeable strip.
 */
export default function FieldNotes() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = trackRef.current;
          const section = sectionRef.current;
          if (!track || !section) return;

          const distance = () => track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + distance(),
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="field-notes"
      className="flex min-h-svh flex-col justify-center overflow-hidden py-28 md:py-0"
    >
      <div className="mx-auto mb-14 w-full max-w-7xl px-6 md:px-10">
        <div className="mb-4 flex items-baseline justify-between gap-6">
          <span className="label-mono">
            <span className="text-accent">05</span> / {sectionTotal}
          </span>
          <span className="annotation hidden sm:inline">
            a digital garden - small thoughts, planted as they grow
          </span>
        </div>
        <div className="rule mb-6" />
        <h2 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-tight">
          field notes
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex w-max gap-6 overflow-x-auto px-6 pb-6 md:overflow-visible md:px-10 md:pb-0"
      >
        {fieldNotes.map((note, i) => (
          <article
            key={note.id}
            className="note-card flex w-[300px] shrink-0 flex-col justify-between p-6 md:w-[360px] md:p-8"
            style={{ transform: `rotate(${i % 2 === 0 ? -0.8 : 0.9}deg)` }}
          >
            <div>
              <div className="mb-6 flex items-baseline justify-between">
                <span className="font-mono text-xs text-accent">
                  № {note.id}
                </span>
                <span className="label-mono">{note.topic}</span>
              </div>
              <p className="font-display text-xl leading-snug text-ink md:text-2xl">
                {note.body}
              </p>
            </div>
            <div className="mt-10 rule" />
          </article>
        ))}

        {/* end card */}
        <article className="note-card flex w-[300px] shrink-0 items-center justify-center p-8 md:w-[360px]">
          <p className="annotation text-center">
            more notes growing.
            <br />
            gardens take time.
          </p>
        </article>
      </div>
    </section>
  );
}
