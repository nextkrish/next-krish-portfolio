import { Button, SectionLabel } from "@/components/ui";

export default function NotFound() { return <section className="not-found container"><SectionLabel>404 / A little off the path</SectionLabel><h1 className="editorial">Nothing cooking<br /><em>here.</em></h1><p>Let’s get you back to something good.</p><Button href="/" light>Back to home</Button></section>; }
