export const inquiryRecipient = "workwithdevskrish@gmail.com";

export function gmailConfiguration(env: Record<string, string | undefined>) {
  const user = env.GMAIL_USER?.trim();
  const pass = env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !pass || pass.length !== 16) return null;
  return {
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user, pass },
    connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000,
    tls: { minVersion: "TLSv1.2" as const },
  };
}
