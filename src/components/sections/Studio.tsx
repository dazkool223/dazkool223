"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import ViolinScene from "@/components/three/ViolinScene";
import { studio } from "@/lib/data";

export type StudioArticle = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  readingMinutes: number;
};

/**
 * The studio: violin, sketchbook, trail log, and the journal. The human
 * bits, given the same care as the engineering ones.
 */
export default function Studio({ articles }: { articles: StudioArticle[] }) {
  return (
    <section
      id="studio"
      className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40"
    >
      <SectionHeading
        index="04"
        title="studio"
        note="the parts of me that don't compile"
      />

      <Reveal>
        <p className="mb-20 max-w-xl text-lg leading-relaxed text-muted">
          {studio.intro}
        </p>
      </Reveal>

      {/* ---- the violin ---- */}
      <div className="mb-28 grid items-center gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="label-mono mb-6 text-accent">
            exhibit a - {studio.violin.title}
          </p>
          {studio.violin.paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-6 text-base leading-relaxed text-ink/90 md:text-lg"
            >
              {p}
            </p>
          ))}
        </Reveal>
        <Reveal delay={0.15} className="md:col-span-6 md:col-start-7">
          <div className="fig-frame h-[420px] bg-surface/30 md:h-[520px]">
            <ViolinScene />
          </div>
          <p className="annotation mt-4 text-right">{studio.violin.hint}</p>
        </Reveal>
      </div>

      {/* ---- the sketchbook ---- */}
      <div className="mb-28">
        <Reveal>
          <p className="label-mono mb-8 text-accent">exhibit b - sketchbook</p>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {studio.sketches.map((sketch, i) => (
            <Reveal key={sketch.src} delay={i * 0.08}>
              <figure
                className="group"
                style={{ transform: `rotate(${[-1, 0.8, -0.6][i % 3]}deg)` }}
              >
                <div className="fig-frame overflow-hidden bg-surface/50 transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-0">
                  <img
                    src={sketch.src}
                    alt={sketch.title}
                    className="h-72 w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between">
                  <span className="font-mono text-xs text-muted">
                    {sketch.title}
                  </span>
                  <span className="font-mono text-[11px] text-faint">
                    {sketch.note}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="annotation mt-8 text-right">
            slower than ctrl+z, better for thinking
          </p>
        </Reveal>
      </div>

      {/* ---- the trail log ---- */}
      <div className="mb-28">
        <Reveal>
          <p className="label-mono mb-8 text-accent">exhibit c - trail log</p>
        </Reveal>
        <div>
          {studio.treks.map((trek, i) => (
            <Reveal key={trek.name} delay={i * 0.05}>
              <div className="grid gap-2 border-t border-line py-7 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-4">
                  <h3 className="font-display text-2xl font-medium">
                    {trek.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {trek.region}
                  </p>
                </div>
                <p className="font-mono text-sm text-accent md:col-span-2">
                  ▲ {trek.elevation}
                </p>
                <p className="text-sm leading-relaxed text-muted md:col-span-6 md:text-base">
                  {trek.note}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="rule" />
        </div>
      </div>

      {/* ---- the journal ---- */}
      <div id="journal">
        <Reveal>
          <div className="mb-2 flex items-baseline justify-between gap-6">
            <p className="label-mono text-accent">exhibit d - the journal</p>
            <span className="annotation hidden sm:inline">
              longer-form thoughts, written slowly
            </span>
          </div>
        </Reveal>
        <div>
          {articles.map((article, i) => (
            <Reveal key={article.slug} delay={i * 0.05}>
              <Link
                href={`/journal/${article.slug}`}
                data-cursor
                className="group grid gap-3 border-t border-line py-8 transition-colors duration-500 hover:bg-accent-dim/40 md:grid-cols-12 md:gap-8"
              >
                <div className="md:col-span-2">
                  <p className="font-mono text-xs tracking-[0.18em] text-accent">
                    {article.date}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-faint">
                    {article.readingMinutes} min read
                  </p>
                </div>
                <h3 className="font-display text-xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-3 md:col-span-5 md:text-2xl">
                  {article.title}
                </h3>
                <div className="flex items-start justify-between gap-6 md:col-span-5">
                  <p className="text-sm leading-relaxed text-muted">
                    {article.summary}
                  </p>
                  <span
                    aria-hidden
                    className="mt-1 font-mono text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
          <div className="rule" />
        </div>
      </div>

      <Reveal>
        <p className="mt-12 font-mono text-xs leading-relaxed text-faint">
          <span className="text-accent">$</span> {studio.outro}
        </p>
      </Reveal>
    </section>
  );
}
