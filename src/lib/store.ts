"use client";

import { emptySubmission, type VeridiaSubmission } from "./types";
import { shortId } from "./utils";

/**
 * Store da VeridIA no cliente.
 * Fonte de verdade imediata: localStorage (offline, salvamento contínuo —
 * princípio de design 5). Em paralelo, sincroniza best-effort com o backend
 * (Supabase via /api/submissions) quando configurado. Falha de rede nunca
 * bloqueia o usuário.
 */

const KEY = (id: string) => `veridia:sub:${id}`;
const INDEX = "veridia:index";

function readIndex(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(INDEX) ?? "[]");
  } catch {
    return [];
  }
}

function writeIndex(ids: string[]) {
  localStorage.setItem(INDEX, JSON.stringify(Array.from(new Set(ids))));
}

export function createSubmission(): VeridiaSubmission {
  const sub = emptySubmission(shortId());
  persistLocal(sub);
  writeIndex([sub.id, ...readIndex()]);
  void syncRemote(sub);
  return sub;
}

export function loadLocal(id: string): VeridiaSubmission | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VeridiaSubmission;
  } catch {
    return null;
  }
}

export function persistLocal(sub: VeridiaSubmission) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY(sub.id), JSON.stringify(sub));
  const idx = readIndex();
  if (!idx.includes(sub.id)) writeIndex([sub.id, ...idx]);
}

export async function syncRemote(sub: VeridiaSubmission): Promise<void> {
  try {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
      keepalive: true,
    });
  } catch {
    /* offline / sem backend — ok, localStorage cuida */
  }
}

export function saveSubmission(sub: VeridiaSubmission) {
  const next = { ...sub, updatedAt: new Date().toISOString() };
  persistLocal(next);
  void syncRemote(next);
  return next;
}

/** Carrega por id: tenta backend (se configurado), cai para localStorage. */
export async function loadSubmission(
  id: string,
): Promise<VeridiaSubmission | null> {
  const local = loadLocal(id);
  try {
    const res = await fetch(`/api/submissions/${id}`, { cache: "no-store" });
    const json = await res.json();
    if (json.configured && json.submission) {
      persistLocal(json.submission);
      return json.submission as VeridiaSubmission;
    }
  } catch {
    /* ignore */
  }
  return local;
}

/** Backoffice: lista do backend; em modo local agrega do localStorage. */
export async function listAllSubmissions(): Promise<VeridiaSubmission[]> {
  try {
    const res = await fetch("/api/submissions", { cache: "no-store" });
    const json = await res.json();
    if (json.configured) return json.submissions as VeridiaSubmission[];
  } catch {
    /* ignore */
  }
  return readIndex()
    .map((id) => loadLocal(id))
    .filter((s): s is VeridiaSubmission => Boolean(s))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
