"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { VeridiaSays, UserSays } from "@/components/veridia/VeridiaSays";
import { SpecialistButton } from "@/components/flow/SpecialistButton";
import { useSubmission } from "@/lib/useSubmission";
import { runPreFeasibility } from "@/lib/engine";
import { resultPath } from "@/lib/flow";
import { buildTurns } from "./turns";

export function ChatFlow({ id }: { id: string }) {
  const router = useRouter();
  const { submission, loading, saveState, setSubmission } = useSubmission(id);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const turns = submission ? buildTurns(submission) : [];
  const activeIndex = submission
    ? turns.findIndex((t) => !t.answered(submission))
    : -1;
  const done = submission != null && activeIndex === -1 && turns.length > 0;

  // Conversa concluída → gera resultado e vai para a tela de resultado.
  useEffect(() => {
    if (!submission || !done) return;
    const result = submission.result ?? runPreFeasibility(submission);
    const next = { ...submission, status: "preliminar_pronto" as const, result };
    setSubmission(next);
    import("@/lib/store").then(({ saveSubmission }) => saveSubmission(next));
    router.push(resultPath(submission.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // Auto-scroll a cada nova mensagem.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeIndex, submission?.updatedAt]);

  function commit(next: typeof submission) {
    if (!next) return;
    setSubmission(next);
    import("@/lib/store").then(({ saveSubmission }) => saveSubmission(next));
  }

  if (loading || !submission) {
    return <div className="grid min-h-screen place-items-center text-ink-500">Abrindo a VeridIA...</div>;
  }

  const pct = turns.length ? Math.round(((activeIndex < 0 ? turns.length : activeIndex) / turns.length) * 100) : 0;
  const visible = activeIndex < 0 ? turns : turns.slice(0, activeIndex + 1);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-30 border-b border-ink-300/40 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3">
          <Link href="/" className="text-lg"><Wordmark /></Link>
          <SaveBadge state={saveState} />
        </div>
        <div className="h-1 w-full bg-brand-100">
          <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 space-y-5 px-5 py-8">
        {visible.map((turn, i) => {
          const isActive = i === activeIndex;
          const Input = turn.Input;
          return (
            <div key={turn.id} className="space-y-3">
              <VeridiaSays>{turn.veridia(submission)}</VeridiaSays>
              {isActive ? (
                <div className="pl-12">
                  <Input sub={submission} commit={commit} />
                </div>
              ) : (
                <UserSays>{turn.summary(submission)}</UserSays>
              )}
            </div>
          );
        })}

        {done && (
          <VeridiaSays>
            <p className="text-sm">Pronto! Tô montando o seu diagnóstico...</p>
          </VeridiaSays>
        )}
        <div ref={bottomRef} />
      </main>

      <SpecialistButton variant="fixed" />
    </div>
  );
}

function SaveBadge({ state }: { state: "idle" | "saving" | "saved" }) {
  const m = {
    idle: { dot: "bg-ink-300", text: "Salvo automaticamente" },
    saving: { dot: "bg-brand-400 animate-pulse-soft", text: "Salvando..." },
    saved: { dot: "bg-brand-500", text: "Anotado." },
  }[state];
  return (
    <span className="inline-flex items-center gap-2 text-xs text-ink-500">
      <span className={`h-2 w-2 rounded-full ${m.dot}`} />
      {m.text}
    </span>
  );
}
