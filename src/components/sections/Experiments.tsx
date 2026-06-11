"use client";

import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { experiments } from "@/lib/data";

export default function Experiments() {
  return (
    <section
      id="experiments"
      className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40"
    >
      <SectionHeading
        index="03"
        title="experiments"
        note="side projects, in lab-notebook form"
      />

      <div>
        {experiments.map((exp, i) => (
          <Reveal key={exp.name} delay={i * 0.04}>
            <article
              data-cursor
              className="group grid gap-4 border-t border-line py-12 transition-colors duration-500 hover:bg-accent-dim/40 md:grid-cols-12 md:gap-8"
            >
              <div className="flex items-start justify-between md:col-span-2 md:block">
                <p className="font-mono text-xs text-accent">{exp.fig}</p>
                <p className="font-mono text-xs text-faint md:mt-2">{exp.year}</p>
              </div>

              <div className="md:col-span-6">
                <h3 className="font-display text-3xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-3 md:text-5xl">
                  {exp.name}
                  <span className="text-accent">/</span>
                </h3>
                <p className="annotation mt-3">{exp.tagline}</p>
              </div>

              <div className="md:col-span-4">
                <p className="text-sm leading-relaxed text-muted md:text-base">
                  {exp.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {exp.stack.map((s) => (
                    <span
                      key={s}
                      className="border border-line px-2.5 py-1 font-mono text-[11px] text-muted transition-colors group-hover:border-accent/40"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
                  status: <span className="text-accent">{exp.status}</span>
                </p>
              </div>
            </article>
          </Reveal>
        ))}
        <div className="rule" />
      </div>

      <Reveal>
        <p className="annotation mt-6 text-right">
          results not guaranteed. learning is.
        </p>
      </Reveal>
    </section>
  );
}
