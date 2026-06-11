import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getArticles, formatDate } from "@/lib/articles";

/**
 * Server component: lists markdown articles from content/articles.
 * Writing a new article = dropping a .md file in that folder.
 */
export default function Journal() {
  const articles = getArticles();

  return (
    <section
      id="journal"
      className="mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40"
    >
      <SectionHeading
        index="06"
        title="journal"
        note="longer-form thoughts, written slowly"
      />

      <div>
        {articles.map((article, i) => (
          <Reveal key={article.slug} delay={i * 0.05}>
            <Link
              href={`/journal/${article.slug}`}
              data-cursor
              className="group grid gap-3 border-t border-line py-10 transition-colors duration-500 hover:bg-accent-dim/40 md:grid-cols-12 md:gap-8"
            >
              <div className="md:col-span-2">
                <p className="font-mono text-xs tracking-[0.18em] text-accent">
                  {formatDate(article.date)}
                </p>
                <p className="mt-1 font-mono text-[11px] text-faint">
                  {article.readingMinutes} min read
                </p>
              </div>
              <h3 className="font-display text-2xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-3 md:col-span-5 md:text-3xl">
                {article.title}
              </h3>
              <div className="flex items-start justify-between gap-6 md:col-span-5">
                <p className="text-sm leading-relaxed text-muted md:text-base">
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

      <Reveal>
        <p className="annotation mt-6 text-right">
          new entries land here whenever something is worth writing down
        </p>
      </Reveal>
    </section>
  );
}
