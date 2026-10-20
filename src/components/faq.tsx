import { StructuredData } from "./structured-data";
import { faqs } from "@/lib/content";
import { Plus } from "./icons";
import { SectionLabel } from "./ui";

export function FAQ({ compact = false }: { compact?: boolean }) {
  return <><StructuredData data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(faq => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} /><section className={`faq-section container section-space ${compact ? "compact" : ""}`} id="faq" aria-labelledby="faq-title"><div className="faq-heading"><SectionLabel>A little clarity</SectionLabel><h2 className="editorial" id="faq-title" data-reveal="text">A few things,<br /><em>answered.</em></h2></div><div className="faq-list" data-reveal="up">{faqs.map((faq, i) => <details key={faq.question} className="faq-item" name="portfolio-faq" open={i === 0}><summary>{faq.question}<Plus /></summary><div className="faq-answer"><p>{faq.answer}</p></div></details>)}</div></section></>;
}
