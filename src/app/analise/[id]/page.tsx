import { ChatFlow } from "@/features/chat/ChatFlow";

export default function AnalisePage({ params }: { params: { id: string } }) {
  return <ChatFlow id={params.id} />;
}
