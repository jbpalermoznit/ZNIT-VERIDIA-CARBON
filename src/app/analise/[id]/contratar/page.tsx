import { Checkout } from "@/components/checkout/Checkout";

export default function ContratarPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { plano?: string };
}) {
  return <Checkout id={params.id} plano={searchParams.plano} />;
}
