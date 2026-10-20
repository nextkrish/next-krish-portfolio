import profile from "../../content/profile.json";

export { profile };

const details: Record<string, { color: string; tone: string; line: string; brief: string; focus: string; decisions: string[] }> = {
  relayup: {
    color: "#264837", tone: "sage", line: "A missed call. A better next step.",
    brief: "A landing page for a missed-call follow-up concept. The story introduces the problem, explains the recovery flow, and gives interested businesses a clear next step.",
    focus: "Making an unfamiliar product feel understandable, one step at a time.",
    decisions: ["A direct, problem-led introduction", "A visual explanation of the follow-up workflow", "Feature sections, business use cases, and frequently asked questions"],
  },
  nextdm: {
    color: "#dfe5f8", tone: "periwinkle", line: "Less inbox. More possibility.",
    brief: "A landing page presenting an Instagram DM automation concept. Product storytelling and interface illustrations explain the idea without asking visitors to work through a wall of text.",
    focus: "Bringing a small workflow change to life through a clear visual story.",
    decisions: ["A conversational product introduction", "Workflow and use-case sections", "An easy-to-find signup area and useful FAQs"],
  },
  "velvet-touch-salon": {
    color: "#d8c8b8", tone: "sand", line: "A little more room for beauty.",
    brief: "A salon website built around atmosphere, services, and the people behind the work. A lookbook and visit section make the experience feel tangible before someone walks through the door.",
    focus: "Giving a local business a considered, inviting digital presence.",
    decisions: ["An image-led introduction", "Clear service and team sections", "A lookbook and a dedicated place to plan a visit"],
  },
  "agra-iron-gym": {
    color: "#4b4a43", tone: "iron", line: "Built with a stronger presence.",
    brief: "A gym website with a direct introduction and distinct sections for the environment, nutrition, pricing, and visiting the gym. Its visual language reflects the energy of the space.",
    focus: "Helping visitors understand the gym and find their next step.",
    decisions: ["A bold, focused introduction", "Training environment and nutrition sections", "Straightforward pricing and contact information"],
  },
};

export const projects = profile.projects.map((project, index) => ({
  ...project, ...details[project.slug], index: String(index + 1).padStart(2, "0"),
  image: `/images/projects/${project.slug}.webp`,
  detailImage: `/images/projects/${project.slug}${project.slug === "agra-iron-gym" ? "" : "-detail"}.webp`,
  domain: new URL(project.url).hostname,
}));
export type Project = (typeof projects)[number];

export const faqs = [
  { question: "Who is Next Krish?", answer: "Next Krish is the personal brand of Krish Kumar, a BCA student at St. Johns College, Agra, and a website developer. I build landing pages and business websites, and I’m open to projects, developer opportunities, and collaborations." },
  { question: "What can we build together?", answer: "I’m currently taking on website projects — from focused landing pages to websites for local businesses. Tell me what you have in mind, and we’ll agree on a scope I can deliver." },
  { question: "How does a project begin?", answer: "Send me a little about your business or idea, the pages you need, and a few references you like. We’ll talk through the purpose, content, scope, and next steps." },
  { question: "Are you open to developer roles?", answer: "Yes. I’m interested in internships, full-time opportunities, and collaborations where I can contribute and continue growing as a developer." },
  { question: "What shapes the timeline and price?", answer: "The number of pages, content, features, and level of interaction all matter. Once we’ve agreed on the scope, we can discuss a realistic schedule and estimate." },
  { question: "Do you build full-stack applications?", answer: "My current service focuses on websites. I’m learning the wider full-stack toolkit and will be clear about what I can take on before agreeing to a project." },
];

export const socials = [
  { label: "GitHub", href: profile.links.github },
  { label: "LinkedIn", href: profile.links.linkedin },
  { label: "Instagram", href: profile.links.instagram },
  { label: "YouTube", href: profile.links.youtube },
];
