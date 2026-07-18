// روابط واتساب للواجهة — الرقم يأتي من متغير بيئة عام، لا يُكتب في الكود أبداً.

export function whatsappLink(message: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const encoded = encodeURIComponent(message);
  return number
    ? `https://wa.me/${number}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}
