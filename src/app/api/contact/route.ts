import { deliverInquiry } from "@/lib/mail";
import { validateContact, isSameOrigin } from "@/lib/contact";

export const runtime = "nodejs";
export const maxDuration = 30;

const requests = new Map<string, { count: number; reset: number }>();
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > 12000) return Response.json({ error: "Message too large." }, { status: 413 });
  if (!isSameOrigin(request)) return Response.json({ error: "Please send your message from the website." }, { status: 403 });
  let body: unknown;
  try { const raw = await request.text(); if (raw.length > 12000) return Response.json({ error: "Message too large." }, { status: 413 }); body = JSON.parse(raw); }
  catch { return Response.json({ error: "Please check your message." }, { status: 400 }); }
  const result = validateContact(body);
  if (!result.valid) return Response.json({ error: "Please check the form fields.", fields: result.errors }, { status: 400 });
  if (result.data.company) return Response.json({ ok: true });
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  if (requests.size > 1000) for (const [id, value] of requests) if (value.reset < now) requests.delete(id);
  const limit = requests.get(key);
  if (limit && limit.reset > now && limit.count >= 5) return Response.json({ error: "Please wait a little before sending another message." }, { status: 429 });
  requests.set(key, { count: limit && limit.reset > now ? limit.count + 1 : 1, reset: limit && limit.reset > now ? limit.reset : now + 15 * 60 * 1000 });
  if (requests.size > 2000) return Response.json({ error: "Please try again later or use direct email." }, { status: 429 });
  try {
    const accepted = await deliverInquiry(result.data);
    if (!accepted) return Response.json({ error: "Your inquiry has not been sent. Please use email or WhatsApp below while direct delivery is being connected.", code: "EMAIL_NOT_CONFIGURED" }, { status: 503 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Your inquiry has not been sent. Please try again or use email or WhatsApp below." }, { status: 502 });
  }
}
