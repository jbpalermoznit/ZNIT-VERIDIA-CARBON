"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createSubmission, listAllSubmissions } from "@/lib/store";
import { analysisPath } from "@/lib/flow";

export function StartButton({
  size = "lg",
  children = "Descobrir o potencial da minha terra",
}: {
  size?: "md" | "lg";
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    // Retoma uma análise em andamento, se houver (princípio 5).
    const existing = (await listAllSubmissions()).find(
      (s) => s.status === "em_andamento",
    );
    const sub = existing ?? createSubmission();
    router.push(analysisPath(sub.id));
  }

  return (
    <Button variant="brand" size={size} onClick={start} disabled={loading}>
      {loading ? "Abrindo a VeridIA..." : children}
    </Button>
  );
}
