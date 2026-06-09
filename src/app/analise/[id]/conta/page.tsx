import { SignupGate } from "@/components/flow/SignupGate";

export default function ContaPage({ params }: { params: { id: string } }) {
  return <SignupGate id={params.id} />;
}
