import SectionHeading from "@/components/SectionHeading";

// Ported verbatim from the site's real usages (src/components/sections/*).

export function Experiments() {
  return (
    <SectionHeading
      index="03"
      title="experiments"
      note="projects, tools and lessons - the whole lab"
    />
  );
}

export function Studio() {
  return (
    <SectionHeading
      index="04"
      title="studio"
      note="the parts of me that don't compile"
    />
  );
}

export function SayHello() {
  return (
    <SectionHeading index="05" title="say hello" note="the inbox is always full /s" />
  );
}
