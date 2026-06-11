import fs from "fs";
import path from "path";

export type Article = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  summary: string;
  body: string; // raw markdown
  readingMinutes: number;
};

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

/** Minimal frontmatter parser: `---\nkey: value\n---\nbody`. */
function parse(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: match[2].trim() };
}

export function getArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
      const { meta, body } = parse(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: meta.title ?? file,
        date: meta.date ?? "1970-01-01",
        summary: meta.summary ?? "",
        body,
        readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 200)),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00")
    .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    .toUpperCase();
}
