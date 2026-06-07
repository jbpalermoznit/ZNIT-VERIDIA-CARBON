import { cn } from "@/lib/utils";
import type { ClassificationLevel } from "@/lib/types";

const styles: Record<ClassificationLevel, string> = {
  favoravel: "bg-brand-100 text-brand-600",
  atencao: "bg-amber-50 text-atencao",
  critico: "bg-red-50 text-critico",
};

export function ClassBadge({
  level,
  children,
}: {
  level: ClassificationLevel;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[level],
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          level === "favoravel" && "bg-favoravel",
          level === "atencao" && "bg-atencao",
          level === "critico" && "bg-critico",
        )}
      />
      {children}
    </span>
  );
}

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-ink-300/30 px-2.5 py-1 text-xs font-medium text-ink-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
