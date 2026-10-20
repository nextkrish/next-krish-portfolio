import sharp from "sharp";
import { mkdir, copyFile, access } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
await mkdir(path.join(root, "public/images/projects"), { recursive: true });
for (const [source, name, width] of [["portrait-warm-rim-light.png", "portrait-warm", 1400], ["nextkrish-logo-original.png", "logo-original", 1280], ["portrait-editorial-v2.png", "portrait-editorial-v2", 1100]]) {
  await sharp(path.join(root, "assets/source", source)).resize({ width, withoutEnlargement: true }).webp({ quality: 90 }).toFile(path.join(root, "public/images", `${name}.webp`));
}
const slugs = ["relayup", "nextdm", "velvet-touch-salon", "agra-iron-gym"];
for (const slug of slugs) for (const suffix of ["", "-detail"]) {
  if (slug === "agra-iron-gym" && suffix === "-detail") continue;
  const source = path.join(root, "assets/project-captures", `${slug}${suffix}.jpg`);
  await access(source);
  await sharp(source).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 88 }).toFile(path.join(root, "public/images/projects", `${slug}${suffix}.webp`));
}
await copyFile(path.join(root, "output/pdf/Krish-Kumar-Resume.pdf"), path.join(root, "public/Krish-Kumar-Resume.pdf"));
await sharp(path.join(root, "assets/source/portrait-warm-rim-light.png")).resize({ width: 650 }).jpeg({ quality: 85 }).toFile(path.join(root, "public/images/social-portrait.jpg"));
console.log("Prepared portraits, original footer mark, seven project captures, and résumé.");

// Pre-render the critical hero so first paint does not wait on an image function.
for (const width of [480, 750, 1400]) {
  const input = path.join(root, "assets/source/portrait-warm-rim-light.png");
  await sharp(input).resize({width}).avif({quality:55}).toFile(path.join(root, `public/images/hero-${width}.avif`));
  await sharp(input).resize({width}).webp({quality:80}).toFile(path.join(root, `public/images/hero-${width}.webp`));
}

await import("./prepare-portrait-points.mjs");
