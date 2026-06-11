import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Console from "@/components/Console";
import { getArticles } from "@/lib/articles";
import Hero from "@/components/sections/Hero";
import Readme from "@/components/sections/Readme";
import Worklog from "@/components/sections/Worklog";
import Experiments from "@/components/sections/Experiments";
import Toolbench from "@/components/sections/Toolbench";
import FieldNotes from "@/components/sections/FieldNotes";
import Journal from "@/components/sections/Journal";
import Studio from "@/components/sections/Studio";
import Arcade from "@/components/sections/Arcade";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const articles = getArticles().map(({ slug, title, date }) => ({
    slug,
    title,
    date,
  }));

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
        <Toolbench />
        <FieldNotes />
        <Journal />
        <Studio />
        <Arcade />
      </main>
      <Footer />
    </>
  );
}
