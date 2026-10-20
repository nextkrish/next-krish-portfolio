export const inquiryKinds = ["A website", "A developer role", "A collaboration", "Something else"] as const;
export type ContactData = { name: string; email: string; message: string; kind: string; company?: string };
export type ContactErrors = Partial<Record<keyof ContactData, string>>;

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const source = new URL(origin);
    const host = request.headers.get("host") || new URL(request.url).host;
    return ["http:", "https:"].includes(source.protocol) && source.host === host;
  } catch { return false; }
}

export function validateContact(input: unknown): { valid: true; data: ContactData } | { valid: false; errors: ContactErrors } {
  const raw = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const field = (key: string) => typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  const data = { name: field("name"), email: field("email"), message: field("message"), kind: field("kind"), company: field("company") };
  const errors: ContactErrors = {};
  if (data.name.length < 2 || data.name.length > 100 || /[\r\n]/.test(data.name)) errors.name = "Please enter your name (2–100 characters).";
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.message.length < 20 || data.message.length > 4000) errors.message = "Tell me a little more (20–4,000 characters).";
  if (!(inquiryKinds as readonly string[]).includes(data.kind)) errors.kind = "Choose what you have in mind.";
  return Object.keys(errors).length ? { valid: false, errors } : { valid: true, data };
}

export function emailBody(data: ContactData) {
  return `Hi Krish,\n\n${data.message}\n\nName: ${data.name}\nEmail: ${data.email}\nRegarding: ${data.kind}`;
}
export function contactMailto(data: ContactData) {
  return `mailto:workwithdevskrish@gmail.com?subject=${encodeURIComponent(`${data.kind} - ${data.name}`)}&body=${encodeURIComponent(emailBody(data))}`;
}

export const publicEmailDraft = `mailto:workwithdevskrish@gmail.com?subject=${encodeURIComponent("Portfolio enquiry")}&body=${encodeURIComponent("Hi Krish,\n\nI came across your portfolio and would like to discuss a project or opportunity.\n\n")}`;
export function contactWhatsApp(data?: ContactData) {
  const message = data ? emailBody(data) : "Hi Krish! I came across your portfolio and would like to discuss a website project.";
  return `https://wa.me/919536137241?text=${encodeURIComponent(message)}`;
}
export function contactGmail(data: ContactData) {
  const query = new URLSearchParams({view:"cm",fs:"1",to:"workwithdevskrish@gmail.com",su:`${data.kind} - ${data.name}`,body:emailBody(data)});
  return `https://mail.google.com/mail/?${query}`;
}
