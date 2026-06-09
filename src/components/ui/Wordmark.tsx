import { cn } from "@/lib/utils";

/**
 * Wordmark da VeridIA. "Verid" + "IA" destacado em verde-água (a camada IA).
 * `tone` controla aplicação sobre fundo claro ou verde.
 */
export function Wordmark({
  className,
  tone = "dark",
  withTagline = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  withTagline?: boolean;
}) {
  const base = tone === "light" ? "text-white" : "text-ink-900";
  const accent = tone === "light" ? "text-brand-300" : "text-brand-500";
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className={cn("font-bold tracking-tight", base)}>
        Verid<span className={accent}>IA</span>
      </span>
      {withTagline && (
        <span
          className={cn(
            "mt-1 text-[0.62em] font-medium tracking-wide",
            tone === "light" ? "text-white/70" : "text-ink-500",
          )}
        >
          Inteligência que comprova
        </span>
      )}
    </span>
  );
}

/** Selo "por ZNIT" para rodapés. */
export function ByZnit({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium tracking-wide",
        tone === "light" ? "text-white/70" : "text-ink-500",
      )}
    >
      por
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tone === "light" ? "/logo-white.png" : "/logo.png"}
        alt="ZNIT"
        className="h-3 w-auto"
      />
    </span>
  );
}
