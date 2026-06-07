"use client";

import { useState } from "react";

/**
 * "Falar com um especialista da VeridIA" — princípio de design 8: saída humana
 * sempre visível em todas as telas. Abre um contato leve (WhatsApp/e-mail).
 */
export function SpecialistButton({
  variant = "fixed",
}: {
  variant?: "fixed" | "inline";
}) {
  const [open, setOpen] = useState(false);

  const trigger =
    variant === "fixed" ? (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-float transition hover:bg-ink-700"
      >
        <span aria-hidden>💬</span> Falar com especialista
      </button>
    ) : (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
      >
        Falar com um especialista da VeridIA
      </button>
    );

  return (
    <>
      {trigger}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="card w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-ink-900">
              A VeridIA conecta você a um especialista
            </h3>
            <p className="mt-2 text-sm text-ink-700">
              Um especialista da VeridIA pode te ajudar a entender o resultado e
              os próximos passos. Sem compromisso.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20vim%20da%20VeridIA%20e%20gostaria%20de%20falar%20com%20um%20especialista."
                target="_blank"
                rel="noreferrer"
                className="btn-brand"
              >
                Chamar no WhatsApp
              </a>
              <a href="mailto:veridia@znit.com.br" className="btn-ghost">
                Enviar e-mail
              </a>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full text-center text-sm text-ink-500 hover:text-ink-900"
            >
              Agora não
            </button>
          </div>
        </div>
      )}
    </>
  );
}
