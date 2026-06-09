"use client";

import { useState } from "react";
import type { VeridiaSubmission, PreFeasibilityResult } from "@/lib/types";

export function DownloadPdfButton({
  submission,
  result,
  className,
  label = "Baixar relatório em PDF",
}: {
  submission: VeridiaSubmission;
  result: PreFeasibilityResult;
  className?: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function generate() {
    setBusy(true);
    try {
      const [{ pdf }, { ReportPdfDoc }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ReportPdfDoc"),
      ]);
      const blob = await pdf(
        <ReportPdfDoc submission={submission} result={result} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const name = (submission.property.propertyName ?? "veridia")
        .normalize("NFD")
        .replace(/[^\w]+/g, "-")
        .toLowerCase();
      a.download = `veridia-${name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={generate}
      disabled={busy}
      className={
        className ??
        "text-sm font-medium text-white/90 underline-offset-4 hover:underline disabled:opacity-60"
      }
    >
      {busy ? "Gerando PDF..." : label}
    </button>
  );
}
