import test from "node:test";
import assert from "node:assert/strict";
import { validateContact, contactMailto, isSameOrigin } from "../src/lib/contact.ts";

const enquiry = { name: "Alex Doe", email: "alex@example.com", message: "I would like a website for my local business.", kind: "A website" };
test("accepts a complete enquiry and trims whitespace", () => { const result = validateContact({ ...enquiry, name: "  Alex Doe  " }); assert.equal(result.valid, true); if (result.valid) assert.equal(result.data.name, "Alex Doe"); });
test("rejects invalid fields, oversized messages and header injection", () => { for (const input of [{ ...enquiry, email: "not-an-email" }, { ...enquiry, message: "hello" }, { ...enquiry, message: "x".repeat(4001) }, { ...enquiry, name: "Alex\nBcc:other@example.com" }, { ...enquiry, kind: "Unsupported" }]) assert.equal(validateContact(input).valid, false); });
test("malformed payloads return field errors without throwing", () => { for (const input of [null, undefined, [], { name: 3 }]) assert.equal(validateContact(input).valid, false); });
test("email drafts encode user content and address the correct recipient", () => { const data = { ...enquiry, message: "I need a site with an R&D section & pricing = clear." }; const url = new URL(contactMailto(data)); assert.equal(url.pathname, "workwithdevskrish@gmail.com"); assert.ok(url.searchParams.get("body")?.includes(data.message)); assert.equal(url.searchParams.get("subject"), "A website - Alex Doe"); });
test("origin checking accepts the browser host when Next normalizes the internal URL", () => { assert.equal(isSameOrigin(new Request("http://localhost:3000/api/contact", { headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" } })), true); assert.equal(isSameOrigin(new Request("http://localhost:3000/api/contact", { headers: { host: "127.0.0.1:3000", origin: "https://unrelated.example" } })), false); assert.equal(isSameOrigin(new Request("http://localhost:3000/api/contact", { headers: { origin: "not a URL" } })), false); });

test("WhatsApp and Gmail enquiry links preserve all filled details", async () => {
  const { contactWhatsApp, contactGmail, publicEmailDraft } = await import("../src/lib/contact.ts");
  const data = { ...enquiry, message: "Please discuss a website, budget & schedule = next week." };
  const whatsapp = new URL(contactWhatsApp(data)), gmail = new URL(contactGmail(data));
  assert.equal(whatsapp.hostname,"wa.me"); assert.equal(whatsapp.pathname,"/919536137241");
  for(const value of [data.name,data.email,data.message,data.kind]) assert.ok(whatsapp.searchParams.get('text')?.includes(value));
  assert.equal(gmail.searchParams.get('to'),'workwithdevskrish@gmail.com'); assert.ok(gmail.searchParams.get('body')?.includes(data.message));
  assert.equal(new URL(publicEmailDraft).pathname,'workwithdevskrish@gmail.com');
});

test("Gmail configuration uses TLS and normalizes app-password spaces", async () => {
  const { gmailConfiguration } = await import("../src/lib/mail-config.ts");
  assert.equal(gmailConfiguration({}), null);
  assert.equal(gmailConfiguration({ GMAIL_USER: "sender@example.com" }), null);
  assert.equal(gmailConfiguration({ GMAIL_USER: "sender@example.com", GMAIL_APP_PASSWORD: "not-an-app-password" }), null);
  const configuration = gmailConfiguration({ GMAIL_USER: " sender@example.com ", GMAIL_APP_PASSWORD: "abcd efgh ijkl mnop" });
  assert.equal(configuration?.auth.user, "sender@example.com");
  assert.equal(configuration?.auth.pass, "abcdefghijklmnop");
  assert.equal(configuration?.secure, true);
  assert.equal(configuration?.port, 465);
});
