import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Console from "@/components/Console";
import Hero from "@/components/sections/Hero";
import Readme from "@/components/sections/Readme";
import Worklog from "@/components/sections/Worklog";
import Experiments from "@/components/sections/Experiments";
import Studio from "@/components/sections/Studio";
import Footer from "@/components/sections/Footer";
import { getArticles, formatDate } from "@/lib/articles";

export default function Home() {
  const articles = getArticles().map(
    ({ slug, title, date, summary, readingMinutes }) => ({
      slug,
      title,
      date: formatDate(date),
      summary,
      readingMinutes,
    })
  );

  return (
    <>
      <Preloader />
      <Nav />
      <Console articles={articles} />
      <main>
        <Hero />
        <Readme />
        <Worklog />
        <Experiments />
        <Studio articles={articles} />
      </main>
      <Footer />
    </>
  );
}
