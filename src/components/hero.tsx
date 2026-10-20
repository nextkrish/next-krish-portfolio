import { PortraitParticles } from "./portrait-particles";
import { Arrow } from "./icons";
import { Button } from "./ui";

export function Hero() {
  return <section className="hero" aria-labelledby="hero-title">
    <link rel="preload" as="image" type="image/avif" imageSrcSet="/images/hero-480.avif 480w, /images/hero-750.avif 750w, /images/hero-1400.avif 1400w" imageSizes="(max-width: 700px) 100vw, 650px" fetchPriority="high" />
    <PortraitParticles />
    <div className="hero-meta"><span className="eyebrow">Student. Developer. Curious human.</span><span className="eyebrow availability"><i /> Open to website projects</span></div>
    <div className="portrait-stage">
      <picture style={{display:"contents"}}><source type="image/avif" srcSet="/images/hero-480.avif 480w, /images/hero-750.avif 750w, /images/hero-1400.avif 1400w" sizes="(max-width: 700px) 100vw, 650px" /><img className="hero-portrait" src="/images/hero-750.webp" srcSet="/images/hero-480.webp 480w, /images/hero-750.webp 750w, /images/hero-1400.webp 1400w" alt="Krish Kumar in a black shirt, lit with a warm rim light" width={1280} height={1212} loading="eager" decoding="sync" fetchPriority="high" sizes="(max-width: 700px) 100vw, 650px" /></picture>
      <a className="portrait-explore" href="#selected-work" data-magnetic data-cursor="Explore" aria-label="Explore work — selected projects"><Arrow /><span>Explore work</span></a>
      <span className="portrait-note eyebrow" aria-hidden="true">A little closer.<br />Move your cursor.</span>
    </div>
    <div className="hero-type"><h1 id="hero-title" className="hero-name" data-reveal="hero">Next <em>Krish</em></h1><p className="hero-tagline" data-hero-detail>I cook Projects!</p><p className="hero-description" data-hero-detail>Yo! I’m Krish — a BCA student turning ideas into websites.</p><div className="hero-actions" data-hero-detail><Button href="#selected-work" light>Explore my work</Button><Button href="/contact">Let’s talk</Button></div></div>
    <div className="hero-bottom eyebrow"><a href="#curiosity">Scroll to discover <Arrow direction="down" /></a><span>A personal portfolio / 2026</span><span>Code with a little character.</span></div>
  </section>;
}
