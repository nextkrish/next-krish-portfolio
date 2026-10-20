import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const pages = ["/", "/work", "/about", "/services", "/contact", "/work/relayup", "/work/nextdm", "/work/velvet-touch-salon", "/work/agra-iron-gym"];
const checked = await Promise.all(pages.map(async path => {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.includes("<h1"), `${path}: missing heading`);
  assert.ok(html.includes("Next Krish"), `${path}: missing brand`);
  return { path, status: response.status };
}));
for (const path of ["/Krish-Kumar-Resume.pdf", "/icon.svg", "/robots.txt", "/sitemap.xml", "/opengraph-image"]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (path.endsWith(".pdf")) assert.equal(new TextDecoder().decode(bytes.slice(0, 4)), "%PDF");
  if (path === "/opengraph-image") { assert.equal(response.headers.get("content-type"), "image/png"); await mkdir("artifacts", { recursive: true }); await writeFile("artifacts/social-preview.png", bytes); }
  checked.push({ path, status: response.status });
}
assert.equal((await fetch(base + "/this-page-does-not-exist")).status, 404);
const post = (body, origin = base) => fetch(base + "/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: typeof body === "string" ? body : JSON.stringify(body) });
assert.equal((await post({})).status, 400);
assert.equal((await post("{invalid")).status, 400);
assert.equal((await post({}, "https://unrelated.example")).status, 403);
assert.equal((await post({ message: "x".repeat(13000) })).status, 413);
const valid = { name: "Local QA", email: "qa@example.com", message: "A local verification message. No external email should be delivered.", kind: "A website" };
// In this local configuration there is no mail provider. A valid API call must not report delivery.
assert.equal((await post(valid)).status, 503);
assert.equal((await post({ ...valid, company: "spam honeypot" })).status, 200);
console.log(JSON.stringify({ pages: checked, custom404: "passed", contactValidation: "passed", noProviderDoesNotClaimDelivery: "passed", externalEmailSent: false }, null, 2));
