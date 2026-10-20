import test from "node:test";
import assert from "node:assert/strict";
import { getSiteOrigin, jsonLd } from "../src/lib/seo.ts";

test("canonical origin uses an explicit, Netlify, or Vercel production domain", () => {
  assert.equal(getSiteOrigin({}), null);
  assert.equal(getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }), null);
  assert.equal(getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://portfolio.example/path/" }), "https://portfolio.example");
  assert.equal(getSiteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: "portfolio.example" }), "https://portfolio.example");
  assert.equal(getSiteOrigin({ URL: "https://nextkrish.netlify.app" }), "https://nextkrish.netlify.app");
  assert.equal(getSiteOrigin({ DEPLOY_PRIME_URL: "https://deploy-preview-2--nextkrish.netlify.app" }), "https://deploy-preview-2--nextkrish.netlify.app");
  assert.equal(getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://custom.example", VERCEL_PROJECT_PRODUCTION_URL: "preview.example" }), "https://custom.example");
});

test("structured data cannot terminate its script element", () => {
  const result = jsonLd({ name: "</script><script>alert(1)</script>" });
  assert.equal(result.includes("<"), false);
  assert.deepEqual(JSON.parse(result), { name: "</script><script>alert(1)</script>" });
});
