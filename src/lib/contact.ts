/**
 * Contato do especialista da VeridIA.
 * TODO: substituir pelos dados reais da ZNIT (o cliente vai fornecer).
 * Centralizado aqui para um único ponto de troca.
 */
export const VERIDIA_CONTACT = {
  whatsappNumber: "5511999999999", // placeholder — DDI+DDD+número, só dígitos
  email: "contato@znit.ai", // placeholder
};

export function whatsappLink(message: string): string {
  return `https://wa.me/${VERIDIA_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function emailLink(subject: string, body = ""): string {
  const q = new URLSearchParams({ subject, body }).toString();
  return `mailto:${VERIDIA_CONTACT.email}?${q}`;
}
