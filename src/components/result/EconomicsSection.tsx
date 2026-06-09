"use client";

import Link from "next/link";
import { formatBRLRange, formatNumberRange } from "@/lib/utils";
import type { EconomicEstimate } from "@/lib/types";

export function EconomicsSection({
  economics,
  unlocked,
  analysisId,
}: {
  economics: EconomicEstimate;
  unlocked: boolean;
  analysisId: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border-2 border-brand-500 bg-white">
      <div className="bg-brand-500 px-6 py-3">
        <h2 className="text-lg font-bold text-white">
          Seu potencial de receita com créditos de carbono
        </h2>
        <p className="text-sm text-white/90">
          Estimativa de ordem de grandeza para {economics.primaryRouteName.toLowerCase()}.
        </p>
      </div>

      <div className="relative p-6">
        {/* Números */}
        <div className={unlocked ? "" : "pointer-events-none select-none blur-[6px]"}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Figure
              label="Receita potencial por ano"
              value={unlocked ? formatBRLRange(economics.annualRevenueBRL.min, economics.annualRevenueBRL.max) : "R$ •••"}
              highlight
            />
            <Figure
              label={`Acumulado em ${economics.horizonYears} anos`}
              value={unlocked ? formatBRLRange(economics.grossRevenueHorizonBRL.min, economics.grossRevenueHorizonBRL.max) : "R$ ••••"}
            />
            <Figure
              label="Créditos por ano (tCO₂e)"
              value={unlocked ? formatNumberRange(economics.annualCreditsTco2e.min, economics.annualCreditsTco2e.max) : "••• tCO₂e"}
            />
          </div>

          {unlocked && (
            <div className="mt-5 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-ink-900">Como a VeridIA chegou nisso</h3>
                <ul className="mt-2 space-y-1">
                  {economics.assumptions.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                      <span className="text-brand-500">•</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="rounded-xl bg-brand-100 p-3 text-xs text-ink-600">
                {economics.disclaimer}
              </p>
            </div>
          )}
        </div>

        {/* Overlay de desbloqueio (Pro) */}
        {!unlocked && (
          <div className="absolute inset-0 grid place-items-center bg-white/70 p-6 backdrop-blur-[1px]">
            <div className="max-w-sm text-center">
              <svg viewBox="0 0 24 24" className="mx-auto h-8 w-8 text-brand-500" fill="none" aria-hidden>
                <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3 className="mt-3 text-lg font-bold text-ink-900">
                Veja quanto a sua terra pode gerar
              </h3>
              <p className="mt-2 text-sm text-ink-700">
                A estimativa detalhada de receita, com os números e as premissas,
                faz parte do plano Pro.
              </p>
              <Link
                href={`/analise/${analysisId}/contratar?plano=pro`}
                className="btn-brand mt-4 inline-block"
              >
                Desbloquear no Pro
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Figure({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-brand-100/60 p-4">
      <span className="block text-xs text-ink-500">{label}</span>
      <span
        className={
          "mt-1 block font-bold " +
          (highlight ? "text-xl text-brand-600" : "text-lg text-ink-900")
        }
      >
        {value}
      </span>
    </div>
  );
}
