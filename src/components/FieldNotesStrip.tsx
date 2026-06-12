"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { fieldNotes } from "@/lib/data";

/**
 * The digital-garden shelf, embedded inside the experiments section.
 * On desktop the block pins and vertical scroll drives the cards sideways;
 * on mobile it's a plain swipeable strip (no scrollbar).
 */
export default function FieldNotesStrip() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const wrap = wrapRef.current;
          const track = trackRef.current;
          if (!wrap || !track) return;

          const distance = () => track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top top",
              end: () => "+=" + distance(),
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        },
      );
    },
    { scope: wrapRef },
  );

  return (
    /* full-bleed out of the section container, clipped so the track can
       overflow the viewport while it slides */
    <div className="mx-[calc(50%-50vw)] overflow-hidden">
      <div
        ref={wrapRef}
        className="flex flex-col justify-center py-10 md:min-h-svh md:py-0"
      >
        <div className="mx-auto mb-10 w-full max-w-7xl px-6 md:px-10">
          <div className="flex items-baseline justify-between gap-6">
            <p className="label-mono text-accent">bench 03 - Hot Takes</p>
            <span className="annotation hidden md:inline">
              a digital garden - keep scrolling, the shelf slides sideways
            </span>
            <span className="annotation md:hidden">swipe →</span>
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 md:w-max md:snap-none md:overflow-visible md:px-10 md:pb-0"
        >
          {fieldNotes.map((note, i) => (
            <article
              key={note.id}
              className="note-card flex w-[280px] shrink-0 snap-start flex-col justify-between p-6 md:w-[340px] md:p-8"
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
          <article className="note-card flex w-[280px] shrink-0 snap-start items-center justify-center p-8 md:w-[340px]">
            <p className="annotation text-center">
              more notes growing.
              <br />
              gardens take time.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
