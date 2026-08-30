import Reveal from "@/components/Reveal";

export function Default() {
  return (
    <Reveal>
      <div style={{ maxWidth: 420 }}>
        <h3 className="font-display text-3xl font-medium tracking-tight">
          fade-up reveal<span className="text-accent">/</span>
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Wraps any block and animates it up into place once it scrolls into
          view. Used throughout the site for section content.
        </p>
      </div>
    </Reveal>
  );
}

export function Staggered() {
  const items = ["first", "second", "third"];
  return (
    <div className="flex flex-col gap-4">
      {items.map((label, i) => (
        <Reveal key={label} delay={i * 0.12}>
          <div className="border border-line px-4 py-3 font-mono text-sm text-muted">
            {label} · delay {(i * 0.12).toFixed(2)}s
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function LargeOffset() {
  return (
    <Reveal y={80}>
      <div className="border-t border-line pt-6">
        <p className="annotation">a bigger reveal distance (y=80)</p>
      </div>
    </Reveal>
  );
}
