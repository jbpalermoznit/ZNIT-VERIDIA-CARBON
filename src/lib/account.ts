import type { LeadData } from "./types";

/**
 * Conta local da VeridIA (simulada no MVP — sem backend de auth).
 * Guarda o lead capturado no cadastro para reuso e "login" entre análises.
 * Quando o Supabase entrar, este módulo passa a falar com o auth real.
 */
const KEY = "veridia_account";

export interface Account extends LeadData {
  /** Hash leve da senha só para simular o login (NÃO é segurança real). */
  passKey?: string;
}

export function saveAccount(acc: Account) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(acc));
  } catch {
    /* ignore */
  }
}

export function loadAccount(): Account | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Account) : null;
  } catch {
    return null;
  }
}

/** Hash bem simples (djb2) — apenas para simular verificação de senha. */
export function weakHash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}
