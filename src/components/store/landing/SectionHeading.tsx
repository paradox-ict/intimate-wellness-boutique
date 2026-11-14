import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  invert = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  align?: "center" | "left";
  invert?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.22em]",
          invert ? "text-gold" : "text-primary",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 text-4xl font-light leading-[1.08] sm:text-5xl",
          invert && "text-ink-foreground",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed",
            invert ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
