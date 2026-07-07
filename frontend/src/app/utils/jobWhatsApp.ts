export function buildJobWhatsAppUrl(phone: string, jobTitle: string) {
  const text = encodeURIComponent(
    `Hello, I found your ${jobTitle} job post on Agrivo. I am interested in this job. Could you please share more details?`,
  );
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${text}`;
}
