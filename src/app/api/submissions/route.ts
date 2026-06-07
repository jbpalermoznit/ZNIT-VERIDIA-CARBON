import { NextResponse } from "next/server";
import { listSubmissions, upsertSubmission } from "@/lib/db/repository";
import type { VeridiaSubmission } from "@/lib/types";

export const dynamic = "force-dynamic";

// Lista submissões (backoffice). Em modo local retorna configured:false.
export async function GET() {
  const { configured, submissions } = await listSubmissions();
  return NextResponse.json({ configured, submissions });
}

// Cria/atualiza submissão (sincronização do cliente).
export async function POST(req: Request) {
  let body: VeridiaSubmission;
  try {
    body = (await req.json()) as VeridiaSubmission;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body?.id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 });
  }
  const res = await upsertSubmission(body);
  return NextResponse.json(res);
}
