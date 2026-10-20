"use client";

import { useRef, useState, type FormEvent } from "react";
import { inquiryKinds, validateContact, contactMailto, contactWhatsApp, contactGmail, emailBody, type ContactErrors } from "@/lib/contact";
import { Arrow } from "./icons";

export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [kind, setKind] = useState<string>("A website");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentName, setSentName] = useState("");
  const [draft, setDraft] = useState<{ url: string; whatsapp: string; gmail: string; body: string } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus(""); setDraft(null);
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const result = validateContact({ ...values, kind });
    if (!result.valid) { setErrors(result.errors); const key = Object.keys(result.errors)[0]; form.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus(); return; }
    setErrors({});
    setBusy(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data) });
      const payload = await response.json();
      if (!response.ok || payload.ok !== true) throw new Error(payload.error || "That didn’t go through. Please try direct email.");
      setSentName(result.data.name); setStatus("Thank you! Your inquiry has been sent to Krish."); form.current?.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Your inquiry has not been sent. Please try direct email instead."); setDraft({ url: contactMailto(result.data), whatsapp: contactWhatsApp(result.data), gmail: contactGmail(result.data), body: emailBody(result.data) }); }
    finally { setBusy(false); }
  }
  if (sentName) return <div className="inquiry-success" role="status" aria-live="polite" tabIndex={-1}><span className="eyebrow">Inquiry sent</span><h2 className="editorial">Thank you,<br /><em>{sentName.split(" ")[0]}.</em></h2><p>Your inquiry is on its way to Krish’s inbox. He’ll reply to the email address you provided.</p><button className="button" type="button" onClick={() => { setSentName(""); setStatus(""); setKind("A website"); }}>Send another inquiry <Arrow /></button></div>;
  return <form ref={form} className="contact-form" onSubmit={submit} noValidate aria-busy={busy}>
    <span className="eyebrow">A good place to start</span>
    <div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="form-field" htmlFor="contact-name"><span>Your name</span><input id="contact-name" aria-label="Your name" name="name" autoComplete="name" maxLength={100} placeholder="What should I call you?" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} /><span className="field-line" />{errors.name && <span id="name-error" className="field-error">{errors.name}</span>}</label>
    <label className="form-field" htmlFor="contact-email"><span>Email</span><input id="contact-email" aria-label="Email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="Your email address" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} /><span className="field-line" />{errors.email && <span id="email-error" className="field-error">{errors.email}</span>}</label>
    <label className="form-field" htmlFor="contact-message"><span>What are you thinking?</span><textarea id="contact-message" aria-label="What are you thinking?" name="message" rows={3} maxLength={4000} placeholder="A little about your idea, project, or opportunity…" required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} /><span className="field-line" />{errors.message && <span id="message-error" className="field-error">{errors.message}</span>}</label>
    <fieldset className="inquiry-kinds"><legend>What brings you here?</legend>{inquiryKinds.map(value => <label className={kind === value ? "selected" : ""} key={value}><input type="radio" name="kind" value={value} checked={kind === value} onChange={() => setKind(value)} /><span>{value}</span></label>)}</fieldset>
    <button className="button form-submit button-light" type="submit" disabled={busy}><span className="button-ripple" aria-hidden="true" /><span className="button-title"><span>{busy ? "Sending…" : "Send Inquiry"}</span></span><Arrow /></button>
    <p className="form-note">Your details are used only to respond to your inquiry.</p>
    <div className="form-status" role="status" aria-live="polite">{status}</div>
    {draft && <div className="draft-actions"><a className="text-link" href={draft.url}>Open email app <Arrow /></a><a className="text-link" href={draft.gmail} target="_blank" rel="noopener noreferrer">Open Gmail <Arrow /></a><a className="text-link" href={draft.whatsapp} target="_blank" rel="noopener noreferrer">Send on WhatsApp <Arrow /></a><button type="button" className="copy-message" onClick={async () => { try { await navigator.clipboard.writeText(draft.body); setStatus("Message copied. Paste it into an email to workwithdevskrish@gmail.com."); } catch { setStatus("Open your email app using the link, or email Krish directly."); } }}>Copy message</button></div>}
  </form>;
}
