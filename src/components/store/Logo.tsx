import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("group inline-flex items-center gap-2", className)}
      aria-label="RoseCare home"
    >
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand shadow-glow transition-transform duration-500 group-hover:rotate-12">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-primary-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M12 21c-4-3-6-6.5-6-10a6 6 0 0 1 12 0c0 3.5-2 7-6 10Z" />
          <path d="M12 21V9" />
          <path d="M12 13c-1.6-.4-2.8-1.6-3-3.2M12 11c1.6-.4 2.8-1.6 3-3.2" />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-2xl font-medium italic leading-none",
          invert ? "text-ink-foreground" : "text-foreground",
        )}
      >
        RoseCare
      </span>
    </Link>
  );
}
