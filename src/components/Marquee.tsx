const MARQUEE_ITEMS = [
  "I have no idea whatsoever",
  "currently underpaid",
  "why is this marquee so long ?",
  "ask me about a movie recomendation",
  "One rabbit hole away to be an expert in something useless.",
];
export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line py-4">
      <div className="marquee-track flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {MARQUEE_ITEMS.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="label-mono mx-6 text-sm!"
              >
                {item} <span className="ml-12 text-accent">✺</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
