"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createSubmission } from "@/lib/store";
import { accountPath } from "@/lib/flow";

export function StartButton({
  size = "lg",
  children = "Descobrir o potencial da minha terra",
}: {
  size?: "md" | "lg";
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function start() {
    setLoading(true);
    // Sempre começa uma análise nova. Antes da conversa, passa pela tela de
    // conta (cadastro/login) para capturar e salvar o lead.
    const sub = createSubmission();
    router.push(accountPath(sub.id));
  }

  return (
    <Button variant="brand" size={size} onClick={start} disabled={loading}>
      {loading ? "Abrindo a VeridIA..." : children}
    </Button>
  );
}
