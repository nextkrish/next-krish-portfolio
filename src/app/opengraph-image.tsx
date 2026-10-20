import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Next Krish — I cook Projects! Krish Kumar, website developer.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function SocialImage() {
  const [regular, italic, portrait] = await Promise.all([
    readFile(path.join(process.cwd(), "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff")),
    readFile(path.join(process.cwd(), "node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff")),
    readFile(path.join(process.cwd(), "public/images/social-portrait.jpg")),
  ]);
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "65px 78px", color: "#f3f1eb", background: "#080808", fontFamily: "Instrument", position: "relative" }}>
    <img src={`data:image/jpeg;base64,${portrait.toString("base64")}`} alt="" width={650} height={615} style={{ position: "absolute", right: -30, bottom: -45, opacity: .85 }} />
    <div style={{ display: "flex", fontSize: 22, letterSpacing: 2, position: "absolute", top: 60, left: 78 }}>A PERSONAL PORTFOLIO</div>
    <div style={{ display: "flex", gap: 25, fontSize: 140, lineHeight: 1, letterSpacing: -6, marginTop: 60 }}>Next <span style={{ fontStyle: "italic" }}>Krish</span></div>
    <div style={{ display: "flex", fontSize: 40, marginTop: 25 }}>I cook Projects!</div>
    <div style={{ display: "flex", fontSize: 23, color: "#9c978d", position: "absolute", left: 78, bottom: 60 }}>Krish Kumar / Website developer</div>
  </div>, { ...size, fonts: [{ name: "Instrument", data: regular, weight: 400, style: "normal" }, { name: "Instrument", data: italic, weight: 400, style: "italic" }] });
}
