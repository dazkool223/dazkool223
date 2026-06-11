import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getArticle, getArticles, formatDate } from "@/lib/articles";
import { profile } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  return {
    title: article ? `${article.title} - ${profile.name}` : "Journal",
    description: article?.summary,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const html = await marked.parse(article.body);

  return (
    <article className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <Link
        href="/#journal"
        className="label-mono transition-colors hover:text-accent"
      >
        ← back to the workshop
      </Link>

      <header className="mb-12 mt-12">
        <p className="label-mono mb-5">
          <span className="text-accent">{formatDate(article.date)}</span> ·{" "}
          {article.readingMinutes} min read · journal
        </p>
        <h1 className="font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl">
          {article.title}
        </h1>
        <p className="annotation mt-5">{article.summary}</p>
        <div className="rule mt-10" />
      </header>

      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      <footer className="mt-16 border-t border-line pt-8">
        <p className="font-mono text-xs text-faint">
          - {profile.name}, from the workshop
        </p>
        <Link
          href="/#journal"
          className="label-mono mt-4 inline-block transition-colors hover:text-accent"
        >
          ← more entries in the journal
        </Link>
      </footer>
    </article>
  );
}
