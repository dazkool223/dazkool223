"use client";

import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { readme } from "@/lib/data";

export default function Readme() {
  return (
    <section id="readme" className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
      <SectionHeading
        index="01"
        title="readme.md"
        note="start here, like every good repo"
      />

      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          {readme.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="mb-8 text-lg leading-relaxed text-ink/90 md:text-xl">
                {p}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <Reveal delay={0.2}>
            <div className="fig-frame bg-surface/60 p-6">
              <p className="label-mono mb-5 text-accent">$ status --now</p>
              <ul className="flex flex-col gap-4">
                {readme.currently.map((item) => (
                  <li key={item.label} className="font-mono text-sm">
                    <span className="text-faint">{item.label}:</span>{" "}
                    <span className="caret text-ink">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="annotation mt-4 text-right">
              updated more often than my resume
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
