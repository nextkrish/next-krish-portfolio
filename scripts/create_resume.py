from pathlib import Path
import json
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


ROOT = Path(__file__).resolve().parents[1]
PROFILE = json.loads((ROOT / "content/profile.json").read_text())
OUTPUT = ROOT / "output/pdf/Krish-Kumar-Resume.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont("Resume", "/System/Library/Fonts/Supplemental/Arial.ttf"))
pdfmetrics.registerFont(TTFont("Resume-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))
pdfmetrics.registerFontFamily("Resume", normal="Resume", bold="Resume-Bold")

INK = colors.HexColor("#17191c")
MUTED = colors.HexColor("#585f68")
LINE = colors.HexColor("#d9dde2")
STYLES = {
    "name": ParagraphStyle("Name", fontName="Resume-Bold", fontSize=31, leading=35, textColor=INK),
    "role": ParagraphStyle("Role", fontName="Resume", fontSize=12, leading=18, textColor=MUTED),
    "contact": ParagraphStyle("Contact", fontName="Resume", fontSize=9.5, leading=16, textColor=INK),
    "section": ParagraphStyle("Section", fontName="Resume-Bold", fontSize=9, leading=13, textColor=MUTED, spaceBefore=16, spaceAfter=7),
    "body": ParagraphStyle("Body", fontName="Resume", fontSize=10.5, leading=16.5, textColor=INK, alignment=TA_LEFT),
    "small": ParagraphStyle("Small", fontName="Resume", fontSize=9.5, leading=15, textColor=MUTED),
    "label": ParagraphStyle("Label", fontName="Resume-Bold", fontSize=10, leading=16, textColor=INK),
}


def paragraph(text, style="body"):
    return Paragraph(text, STYLES[style])


def section(title):
    return paragraph(title.upper(), "section")


def link(url, label):
    return f'<link href="{escape(url)}" color="#17191c">{escape(label)}</link>'


def page_finish(canvas, document):
    width, _ = A4
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(52, 51, width - 52, 51)
    canvas.setFont("Resume", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(52, 36, "Next Krish / Krish Kumar")
    canvas.drawRightString(width - 52, 36, "October 2026")
    canvas.restoreState()


story = [
    paragraph("Krish Kumar", "name"),
    Spacer(1, 5),
    paragraph("BCA Student | Website Developer", "role"),
    Spacer(1, 8),
    paragraph(link("mailto:" + PROFILE["contact"]["publicEmail"], PROFILE["contact"]["publicEmail"]) + " &nbsp; | &nbsp; " + link("tel:" + PROFILE["contact"]["phone"], PROFILE["contact"]["displayPhone"]), "contact"),
    paragraph(link(PROFILE["links"]["github"], "github.com/nextkrish") + " &nbsp; | &nbsp; " + link(PROFILE["links"]["linkedin"], "linkedin.com/in/nextkrish"), "contact"),
    Spacer(1, 16),
    HRFlowable(width="100%", thickness=0.8, color=INK),
    section("Profile"),
    paragraph("Third-year Bachelor of Computer Applications student focused on building websites and developing skills across modern web technologies. Open to freelance website projects, internships, full-time opportunities, and collaborations."),
    section("Education"),
    paragraph("<b>Bachelor of Computer Applications (BCA)</b>"),
    paragraph("St. Johns College, Agra", "small"),
    paragraph("Year 3 | Expected graduation: 2027", "small"),
    section("Technologies"),
    paragraph("Current learning toolkit; proficiency continues to develop through study and practice.", "small"),
    Spacer(1, 8),
]

skills = [
    [paragraph("Web foundations", "label"), paragraph("HTML, CSS, JavaScript")],
    [paragraph("Frontend", "label"), paragraph("React, Next.js, Tailwind CSS")],
    [paragraph("Backend exploration", "label"), paragraph("Node.js, Express, MongoDB")],
    [paragraph("Motion and workflow", "label"), paragraph("GSAP, Three.js, Git")],
]
table = Table(skills, colWidths=[139, A4[0] - 104 - 139], hAlign="LEFT")
table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (0, -1), 12),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
]))
story.extend([
    table,
    section("Selected projects"),
])
for project in PROFILE["projects"]:
    story.extend([
        paragraph("<b>" + escape(project["name"]) + "</b> - " + escape(project["category"])),
        paragraph(escape(project["resumeDescription"]), "small"),
        paragraph(link(project["url"], project["url"].removeprefix("https://").rstrip("/")), "contact"),
        Spacer(1, 8),
    ])
document = SimpleDocTemplate(
    str(OUTPUT), pagesize=A4, rightMargin=52, leftMargin=52,
    topMargin=48, bottomMargin=68, title="Krish Kumar - Resume",
    author="Krish Kumar", subject="Student website developer resume based on supplied information",
)
document.build(story, onFirstPage=page_finish, onLaterPages=page_finish)
print(OUTPUT)
