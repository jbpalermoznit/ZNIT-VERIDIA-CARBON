import type { ScoreClassification } from "@/lib/types";
import { SCORE_CLASSIFICATION } from "@/lib/copy";
import { cn } from "@/lib/utils";

const COLOR: Record<ScoreClassification, string> = {
  baixa_prontidao: "#C0492F",
  prontidao_condicionada: "#C98A2B",
  bom_potencial_com_ajustes: "#3f9686",
  alta_prontidao: "#56B7A5",
};

/** Medidor circular do Score de Prontidão VeridIA (0–100). */
export function ScoreDial({
  total,
  classification,
  size = 184,
}: {
  total: number;
  classification: ScoreClassification;
  size?: number;
}) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - total / 100);
  const color = COLOR[classification];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#E6F3EE"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <span className="text-4xl font-bold text-ink-900">{total}</span>
          <span className="text-xs font-medium text-ink-500">de 100</span>
        </div>
      </div>
      <span
        className={cn("mt-3 text-sm font-semibold")}
        style={{ color }}
      >
        {SCORE_CLASSIFICATION[classification].label}
      </span>
    </div>
  );
}
