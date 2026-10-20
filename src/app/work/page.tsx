import { pageMetadata } from "@/lib/seo";
import { PageIntro, Button, SectionLabel } from "@/components/ui";
import { WorkGrid } from "@/components/work-grid";
import { projects } from "@/lib/content";

export const metadata = pageMetadata("/work", "Selected work", "Four websites by Krish Kumar: RelayUp, NextDM, Velvet Touch Salon, and Agra Iron Gym.");

export default function WorkPage() {
  return <><PageIntro label="The work / 01—04" title={<>Selected <em>work.</em></>}><p>Ideas explored. Websites brought to life.<br />A few projects from my journey so far.</p></PageIntro><section className="container work-page-gallery" aria-labelledby="work-projects-title"><h2 className="sr-only" id="work-projects-title">Portfolio projects</h2><WorkGrid projects={projects} /></section><section className="light-chapter project-invitation section-space"><SectionLabel>Room for the next idea</SectionLabel><h2 className="editorial" data-reveal="text">An idea worth<br /><em>exploring?</em></h2><p>Let’s shape it together.</p><Button href="/contact" light>Start a conversation</Button></section></>;
}
