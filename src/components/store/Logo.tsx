import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, invert = false }: { className?: string; invert?: boolean }) {
  return (
    <Link
      to="/"
      className={cn("group inline-flex min-w-0 items-center gap-1.5 sm:gap-2", className)}
      aria-label="RoseCare home"
    >
      <img
        src="/images/rose-mark.png"
        alt=""
        width={36}
        height={36}
        className="h-7 w-7 shrink-0 rounded-full object-cover shadow-glow transition-transform duration-500 group-hover:rotate-12 sm:h-9 sm:w-9"
      />
      <span className="whitespace-nowrap font-display text-xl font-medium leading-none sm:text-2xl">
        <span className="bg-gradient-to-r from-[#e7548a] via-[#c65a9e] to-[#7c5cd6] bg-clip-text text-transparent">
          Rose
        </span>
        <span className={invert ? "text-ink-foreground" : "text-[#7d8a99]"}>Care</span>
      </span>
    </Link>
  );
}
