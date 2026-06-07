"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { emptySubmission, type VeridiaSubmission } from "./types";
import { loadSubmission, saveSubmission } from "./store";

type SaveState = "idle" | "saving" | "saved";

/**
 * Carrega a submissão e oferece `update()` com salvamento automático
 * (debounce). Reflete o princípio de design 5: o usuário pode sair e voltar.
 */
export function useSubmission(id: string) {
  const [submission, setSubmission] = useState<VeridiaSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadSubmission(id).then((s) => {
      if (!active) return;
      // Deep-link para uma análise inexistente (ex.: outro dispositivo, cache
      // limpo): inicia uma submissão vazia com esse id em vez de travar.
      if (!s) {
        const fresh = emptySubmission(id);
        saveSubmission(fresh);
        setSubmission(fresh);
      } else {
        setSubmission(s);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const update = useCallback(
    (patch: Partial<VeridiaSubmission> | ((s: VeridiaSubmission) => VeridiaSubmission)) => {
      setSubmission((prev) => {
        if (!prev) return prev;
        const next =
          typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
        setSaveState("saving");
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          saveSubmission(next);
          setSaveState("saved");
          setTimeout(() => setSaveState("idle"), 1500);
        }, 500);
        return next;
      });
    },
    [],
  );

  /** Força gravação imediata (ao avançar de etapa). */
  const flush = useCallback((override?: VeridiaSubmission) => {
    setSubmission((prev) => {
      const target = override ?? prev;
      if (target) saveSubmission(target);
      return target ?? prev;
    });
  }, []);

  return { submission, loading, saveState, update, flush, setSubmission };
}
