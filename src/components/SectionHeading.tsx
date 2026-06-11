"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { sectionTotal } from "@/lib/data";

/**
 * Notebook-style section header: index number, oversized title with a
 * per-character scroll reveal, and an optional handwritten margin note.
 */
export default function SectionHeading({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heading = ref.current?.querySelector("h2");
      if (!heading) return;

      document.fonts.ready.then(() => {
        const split = new SplitText(heading, { type: "chars" });
        gsap.set(heading, { opacity: 1 });
        gsap.from(split.chars, {
          yPercent: 110,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.025,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            once: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="mb-14 md:mb-20">
      <div className="mb-4 flex items-baseline justify-between gap-6">
        <span className="label-mono">
          <span className="text-accent">{index}</span> / {sectionTotal}
        </span>
        {note && <span className="annotation hidden sm:inline">{note}</span>}
      </div>
      <div className="rule mb-6" />
      <h2
        className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-tight opacity-0"
        style={{ overflow: "hidden" }}
      >
        {title}
      </h2>
    </div>
  );
}
