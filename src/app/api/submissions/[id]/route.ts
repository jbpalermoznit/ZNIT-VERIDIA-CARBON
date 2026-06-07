import { NextResponse } from "next/server";
import { getSubmission } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const { configured, submission } = await getSubmission(params.id);
  return NextResponse.json({ configured, submission });
}
