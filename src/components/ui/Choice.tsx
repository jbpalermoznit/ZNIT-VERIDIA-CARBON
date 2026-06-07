"use client";

import { cn } from "@/lib/utils";

/** Opção selecionável em formato de card (uma pergunta de cada vez). */
export function Choice({
  selected,
  onClick,
  title,
  description,
  emoji,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  emoji?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition",
        selected
          ? "border-brand-500 bg-brand-100"
          : "border-ink-300/50 bg-white hover:border-brand-400 hover:bg-brand-100/40",
        className,
      )}
    >
      {emoji && <span className="text-2xl leading-none">{emoji}</span>}
      <span className="flex-1">
        <span className="block font-semibold text-ink-900">{title}</span>
        {description && (
          <span className="mt-0.5 block text-sm text-ink-500">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 text-[10px] text-white",
          selected ? "border-brand-500 bg-brand-500" : "border-ink-300",
        )}
      >
        {selected && "✓"}
      </span>
    </button>
  );
}
