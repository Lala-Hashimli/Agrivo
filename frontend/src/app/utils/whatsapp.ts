export function buildWhatsAppUrl(phone: string, farmerName: string) {
  const firstName = farmerName.split(" ")[0];
  const text = encodeURIComponent(
    `Hello ${firstName}, I found your profile on Agrivo. I am interested in your products.`,
  );
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${text}`;
}
