"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { VeridiaSays } from "@/components/veridia/VeridiaSays";
import { SpecialistButton } from "@/components/flow/SpecialistButton";
import { useSubmission } from "@/lib/useSubmission";
import { runPreFeasibility } from "@/lib/engine";
import { resultPath } from "@/lib/flow";
import type { DocumentEntry } from "@/lib/types";

const DOC_TYPES = [
  { type: "matricula", label: "Matrícula atualizada do imóvel", required: true },
  { type: "ccir", label: "CCIR (Cadastro de Imóvel Rural)", required: false },
  { type: "itr", label: "Comprovante de ITR do último ano", required: false },
  { type: "foto", label: "Foto aérea ou de campo da área", required: false },
];

export default function DocumentosPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { submission, loading, saveState, flush } = useSubmission(params.id);
  const [reading, setReading] = useState<string | null>(null);

  if (loading || !submission) {
    return <div className="grid min-h-screen place-items-center text-ink-500">Carregando...</div>;
  }

  const arrendamento = submission.eligibility.ownership === "arrendamento";
  const types = arrendamento
    ? [...DOC_TYPES, { type: "arrendamento", label: "Contrato de arrendamento", required: true }]
    : DOC_TYPES;

  function uploaded(type: string): DocumentEntry | undefined {
    return submission!.documents.find((d) => d.type === type);
  }

  async function handleUpload(type: string, file: File) {
    setReading(type);
    // Simula OCR + extração em background.
    await new Promise((r) => setTimeout(r, 1200));
    const entry: DocumentEntry = {
      type,
      fileName: file.name,
      confirmedByUser: false,
      uploadedAt: new Date().toISOString(),
      extractedData:
        type === "matricula"
          ? { numero: "—", proprietario: submission!.property.propertyName ?? "—" }
          : undefined,
    };
    const docs = [...submission!.documents.filter((d) => d.type !== type), entry];
    const updated = {
      ...submission!,
      status: "refinado_pronto" as const,
      documents: docs,
    };
    const result = runPreFeasibility(updated);
    flush({ ...updated, result });
    setReading(null);
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="brand-mesh px-5 py-6 text-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/"><Wordmark tone="light" /></Link>
          <Link href={resultPath(submission.id)} className="text-sm text-white/90 underline-offset-4 hover:underline">
            Voltar ao resultado
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-5 py-8">
        <VeridiaSays>
          <p className="text-sm">
            A VeridIA já tem o suficiente pra te dar a análise preliminar. Pra
            refinar e dar mais segurança ao resultado, você pode mandar alguns
            documentos quando puder — sem pressa.
          </p>
        </VeridiaSays>

        <div className="space-y-3">
          {types.map((dt) => {
            const doc = uploaded(dt.type);
            return (
              <div key={dt.type} className="card flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-ink-900">
                    {dt.label}
                    {dt.required && <span className="ml-1 text-xs text-atencao">recomendado</span>}
                  </p>
                  {reading === dt.type ? (
                    <p className="mt-0.5 text-sm text-brand-600">Lendo seu documento...</p>
                  ) : doc ? (
                    <p className="mt-0.5 text-sm text-favoravel">✓ {doc.fileName}</p>
                  ) : (
                    <p className="mt-0.5 text-sm text-ink-500">PDF, JPG ou PNG até 20MB</p>
                  )}
                </div>
                <label className="btn-ghost shrink-0 cursor-pointer">
                  {doc ? "Trocar" : "Enviar"}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(dt.type, f);
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>

        {submission.documents.length > 0 && (
          <VeridiaSays animate>
            <p className="text-sm">
              Anotado. A VeridIA atualizou sua análise com os documentos. Quando
              quiser, é só voltar ao resultado.
            </p>
          </VeridiaSays>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push(resultPath(submission.id))}>
            Ver resultado atualizado
          </Button>
          <SpecialistButton variant="inline" />
        </div>
      </main>
      <SpecialistButton variant="fixed" />
    </div>
  );
}
