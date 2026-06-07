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

/** Gera um id curto e legível, sem dependências externas. */
export function shortId(prefix = "sub"): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rand}`;
}
