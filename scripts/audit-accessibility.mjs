import { JSDOM, VirtualConsole } from "jsdom";
import axe from "axe-core";
import { writeFile } from "node:fs/promises";

const base = process.env.QA_BASE_URL || "http://127.0.0.1:3000";
const paths = ["/", "/about", "/services", "/contact", "/work", "/work/relayup", "/work/nextdm", "/work/velvet-touch-salon", "/work/agra-iron-gym"];
const report = { tool: `axe-core ${axe.version} with jsdom`, scope: "Server-rendered semantics only. Layout-dependent contrast, keyboard interaction, mobile geometry and real browser performance require separate verification.", pages: [] };
for (const path of paths) {
  const response = await fetch(base + path);
  const dom = new JSDOM(await response.text(), { url: base + path, runScripts: "outside-only", virtualConsole: new VirtualConsole() });
  dom.window.eval(axe.source);
  const result = await dom.window.axe.run(dom.window.document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] }, rules: { "color-contrast": { enabled: false } } });
  report.pages.push({ path, passes: result.passes.length, violations: result.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })), incomplete: result.incomplete.map(v => v.id) });
  console.log(path, result.violations.length ? JSON.stringify(report.pages.at(-1).violations) : `PASS (${result.passes.length} rules)`);
  dom.window.close();
}
await writeFile("artifacts/accessibility-v14.json", JSON.stringify(report, null, 2));
if (report.pages.some(page => page.violations.length)) process.exitCode = 1;
