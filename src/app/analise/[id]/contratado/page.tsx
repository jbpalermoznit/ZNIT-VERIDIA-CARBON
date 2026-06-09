import { Contratado } from "@/components/checkout/Contratado";

export default function ContratadoPage({ params }: { params: { id: string } }) {
  return <Contratado id={params.id} />;
}
