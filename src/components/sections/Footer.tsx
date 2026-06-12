"use client";

import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import { profile } from "@/lib/data";

const MARQUEE_ITEMS = [
  "open to interesting problems",
  "currently caffeinated",
  "ship small, learn fast",
  "ask me about kafka partitions",
];

export default function Footer() {
  return (
    <footer id="contact" className="relative">
      {/* marquee */}
      <div className="overflow-hidden border-y border-line py-4">
        <div className="marquee-track flex w-max whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="label-mono mx-6 !text-sm"
                >
                  {item} <span className="ml-12 text-accent">✺</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-36">
        <SectionHeading
          index="05"
          title="say hello"
          note="the inbox is always compiling"
        />

        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <p className="max-w-lg text-lg leading-relaxed text-muted md:text-xl">
              If you're building something interesting - or just want to argue
              about retrieval pipelines, micro frontend boundaries, or whether
              the homelab was a good idea - my door is open.
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Magnetic className="inline-block">
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor
                  className="inline-flex items-center gap-4 border border-accent px-8 py-5 font-mono text-sm tracking-wider text-ink transition-colors duration-300 hover:bg-accent hover:text-bg"
                >
                  {profile.email}
                  <span aria-hidden>→</span>
                </a>
              </Magnetic>
              <Magnetic className="inline-block">
                <a
                  href={profile.resume}
                  download="neeraj-kulkarni-python-fullstack.pdf"
                  data-cursor
                  className="inline-flex items-center gap-4 border border-line px-8 py-5 font-mono text-sm tracking-wider text-muted transition-colors duration-300 hover:border-accent hover:text-ink"
                >
                  résumé.pdf
                  <span aria-hidden>↓</span>
                </a>
              </Magnetic>
            </div>
            <p className="annotation mt-5">
              recruiters: the pdf is the boring version. this site is the real
              one.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="md:col-span-4 md:col-start-9">
            <p className="label-mono mb-5">elsewhere</p>
            <ul className="flex flex-col gap-3 font-mono text-sm">
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-accent"
                >
                  github ↗
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-accent"
                >
                  linkedin ↗
                </a>
              </li>
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="label-mono">
            © 2026 {profile.name} · designed & built in the workshop
          </p>
          <p className="label-mono">
            <span className="text-accent">
              “`” opens the console · try “theme list”
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
