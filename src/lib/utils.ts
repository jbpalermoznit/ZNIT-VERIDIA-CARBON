import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formata hectares no padrão brasileiro: 1.234 ha */
export function formatHa(value: number): string {
  return `${new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value)} ha`;
}

/** Formata um valor em reais, compacto para números grandes (R$ 1,2 mi). */
export function formatBRL(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(value / 1_000_000)} mi`;
  }
  return `R$ ${new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(value)}`;
}

/** Formata uma faixa min–max em reais. */
export function formatBRLRange(min: number, max: number): string {
  return `${formatBRL(min)} – ${formatBRL(max)}`;
}

/** Formata uma faixa numérica no padrão brasileiro, com unidade opcional. */
export function formatNumberRange(min: number, max: number, unit = ""): string {
  const f = (n: number) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);
  return `${f(min)} – ${f(max)}${unit ? " " + unit : ""}`;
}

/** Gera um id curto e legível, sem dependências externas. */
export function shortId(prefix = "sub"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rand}`;
}
