"use client";

import { fieldNotes } from "@/lib/data";

/**
 * The digital-garden shelf, embedded inside the experiments section:
 * index cards in a horizontally swipeable strip with scroll snapping.
 * Works the same with a trackpad, a scroll wheel tilt, or a thumb.
 */
export default function FieldNotesStrip() {
  return (
    <div
      data-lenis-prevent
      className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 md:-mx-10 md:px-10"
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
  );
}
