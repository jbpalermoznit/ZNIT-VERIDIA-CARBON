"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatBRLRange, formatNumberRange } from "@/lib/utils";
import type { EconomicEstimate, LeadData } from "@/lib/types";

export function EconomicsSection({
  economics,
  hasLead,
  onUnlock,
}: {
  economics: EconomicEstimate;
  hasLead: boolean;
  onUnlock: (lead: LeadData) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="overflow-hidden rounded-2xl border-2 border-brand-500 bg-white">
      <div className="bg-brand-500 px-6 py-3">
        <h2 className="text-lg font-bold text-white">Quanto o seu pasto pode valer</h2>
        <p className="text-sm text-white/90">
          Estimativa de ordem de grandeza para {economics.primaryRouteName.toLowerCase()}.
        </p>
      </div>

      <div className="relative p-6">
        {/* Números */}
        <div className={hasLead ? "" : "pointer-events-none select-none blur-[6px]"}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Figure
              label="Receita potencial por ano"
              value={hasLead ? formatBRLRange(economics.annualRevenueBRL.min, economics.annualRevenueBRL.max) : "R$ •••"}
              highlight
            />
            <Figure
              label={`Acumulado em ${economics.horizonYears} anos`}
              value={hasLead ? formatBRLRange(economics.grossRevenueHorizonBRL.min, economics.grossRevenueHorizonBRL.max) : "R$ ••••"}
            />
            <Figure
              label="Créditos por ano (tCO₂e)"
              value={hasLead ? formatNumberRange(economics.annualCreditsTco2e.min, economics.annualCreditsTco2e.max) : "••• tCO₂e"}
            />
          </div>

          {hasLead && (
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

        {/* Overlay de desbloqueio */}
        {!hasLead && (
          <div className="absolute inset-0 grid place-items-center bg-white/70 p-6 backdrop-blur-[1px]">
            <div className="max-w-sm text-center">
              <p className="text-2xl">🔒</p>
              <h3 className="mt-2 text-lg font-bold text-ink-900">
                A VeridIA estimou o potencial de receita do seu pasto
              </h3>
              <p className="mt-2 text-sm text-ink-700">
                Deixe seu contato para ver a estimativa de receita e os números
                por trás dela. É grátis e sem compromisso.
              </p>
              <Button className="mt-4" onClick={() => setOpen(true)}>
                Ver minha estimativa de receita
              </Button>
            </div>
          </div>
        )}
      </div>

      {open && (
        <LeadModal
          onClose={() => setOpen(false)}
          onSubmit={(lead) => {
            onUnlock(lead);
            setOpen(false);
          }}
        />
      )}
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

function LeadModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (lead: LeadData) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const valid = name.trim().length > 1 && /.+@.+\..+/.test(email);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4" onClick={onClose}>
      <div className="card w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-ink-900">Quase lá</h3>
        <p className="mt-1 text-sm text-ink-700">
          A VeridIA usa seu contato só para liberar a estimativa e, se você
          quiser, falar sobre os próximos passos.
        </p>
        <div className="mt-4 space-y-3">
          <Field label="Seu nome" value={name} onChange={setName} placeholder="Como podemos te chamar?" />
          <Field label="E-mail" value={email} onChange={setEmail} placeholder="seu@email.com" type="email" />
          <Field label="WhatsApp (opcional)" value={phone} onChange={setPhone} placeholder="(00) 00000-0000" />
        </div>
        <Button
          className="mt-5 w-full"
          disabled={!valid}
          onClick={() =>
            onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim() || undefined, createdAt: new Date().toISOString() })
          }
        >
          Ver minha estimativa
        </Button>
        <p className="mt-3 text-center text-xs text-ink-500">
          Seus dados ficam protegidos e não são compartilhados.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border-2 border-ink-300/60 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </label>
  );
}
