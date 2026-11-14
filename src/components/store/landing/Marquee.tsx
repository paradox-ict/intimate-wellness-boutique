const ITEMS = [
  "Antibacterial",
  "Cleansing",
  "Moisturising",
  "Tightening",
  "Anti-itching",
  "Odour removal",
  "Lubricating",
  "Herbal formula",
  "CE certified",
  "ISO 9001",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-border/60 bg-card py-5" aria-hidden="true">
      <div className="animate-marquee flex w-max gap-10">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-2xl italic text-foreground/70"
          >
            {t}
            <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
          </span>
        ))}
      </div>
    </div>
  );
}
