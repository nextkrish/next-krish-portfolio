"use client";
import { SectionLabel } from "@/components/ui";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="not-found container"><SectionLabel>A small interruption</SectionLabel><h1 className="editorial">Let’s try<br /><em>that again.</em></h1><p>Something interrupted this page. You can retry or get in touch directly.</p><button className="button button-light" onClick={reset}>Try again ↗</button><a className="text-link" style={{ marginLeft: 24 }} href="mailto:workwithdevskrish@gmail.com">Email Krish ↗</a></section>;
}
