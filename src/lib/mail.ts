import "server-only";
import nodemailer from "nodemailer";
import { emailBody, type ContactData } from "./contact";
import { gmailConfiguration, inquiryRecipient } from "./mail-config";

export async function deliverInquiry(data: ContactData) {
  const gmail = gmailConfiguration(process.env);
  if (gmail) {
    const transport = nodemailer.createTransport(gmail);
    try {
      const result = await transport.sendMail({
        from: { name: "Next Krish Portfolio", address: gmail.auth.user },
        to: inquiryRecipient,
        replyTo: { name: data.name, address: data.email },
        subject: `[New inquiry] ${data.kind} — ${data.name}`,
        text: emailBody(data),
        disableFileAccess: true, disableUrlAccess: true,
      });
      if (!result.accepted.map(String).includes(inquiryRecipient)) throw new Error("Delivery was not accepted");
      return true;
    } finally { transport.close(); }
  }
  if (process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [inquiryRecipient], reply_to: data.email, subject: `[New inquiry] ${data.kind} — ${data.name}`, text: emailBody(data) }),
    });
    if (!response.ok) throw new Error("Delivery was not accepted");
    return true;
  }
  return false;
}
