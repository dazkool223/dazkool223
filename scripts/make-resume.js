/**
 * Generates public/resume-generated.pdf - a fallback one-pager.
 * NOTE: the live download (public/resume.pdf) is Neeraj's real
 * "Python Fullstack" resume; this script intentionally writes to a
 * different file so `npm run resume` can never overwrite it.
 */
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const INK = "#1a1a1a";
const MUTED = "#555550";
const ACCENT = "#e04e10";
const LINE = "#d8d4ca";

const resume = {
  name: "Neeraj Kulkarni",
  role: "Fullstack Software Engineer",
  location: "Pune, India",
  // TODO(neeraj): real contact details
  email: "hello@neerajk.dev",
  github: "github.com/dazkool223",
  linkedin: "linkedin.com/in/neeraj-kulkarni",
  summary:
    "Fullstack engineer building enterprise security platform features at Qualys - React micro frontends, Spring Boot services, Kafka pipelines - with hands-on LLM/RAG prototyping. I build things to understand them.",
  experience: [
    {
      role: "Fullstack Software Engineer - Qualys",
      period: "Jul 2024 – Present",
      bullets: [
        "Build micro frontends with Module Federation across an enterprise security platform: independent deploys, one seamless runtime.",
        "Design Spring Boot services with Kafka pipelines and Redis caching backing customer-facing dashboards.",
        "Prototype LLM-assisted features: retrieval over product knowledge using LangChain, ChromaDB and reranking.",
      ],
    },
    {
      role: "Engineering Intern - Qualys",
      period: "Jan 2024",
      bullets: [
        "Shipped production Java code with JUnit coverage; worked across Oracle SQL schemas and CI pipelines.",
      ],
    },
  ],
  education: {
    degree: "B.E. - Savitribai Phule Pune University",
    period: "2020 – 2024",
  },
  skills: [
    ["Languages", "TypeScript, JavaScript, Java, Python, SQL"],
    [
      "Frontend",
      "React, Next.js, Redux Toolkit, Micro Frontends / Module Federation, Jest",
    ],
    [
      "Backend",
      "Spring Boot, FastAPI, Apache Kafka, Redis, PostgreSQL, Oracle SQL, Liquibase, Supabase, JUnit",
    ],
    [
      "AI / ML",
      "LangChain, LangGraph, RAG, ChromaDB, Ollama, Hugging Face, OpenAI & Anthropic APIs",
    ],
    ["Infra", "Kubernetes, Docker, Helm, Consul, Vault, Jenkins, Git"],
  ],
  beyond:
    "Violinist, pencil sketcher, Himalayan trekker. Writes a technical journal at the portfolio below.",
  site: "the digital workshop - portfolio, journal & experiments",
};

const out = path.join(__dirname, "..", "public", "resume-generated.pdf");
const doc = new PDFDocument({ size: "A4", margins: { top: 48, bottom: 42, left: 52, right: 52 } });
doc.pipe(fs.createWriteStream(out));

const W = doc.page.width - 104;

// header
doc.font("Helvetica-Bold").fontSize(24).fillColor(INK).text(resume.name);
doc.moveDown(0.2);
doc.font("Helvetica").fontSize(11).fillColor(ACCENT).text(resume.role);
doc.moveDown(0.3);
doc
  .fontSize(9)
  .fillColor(MUTED)
  .text(
    `${resume.location}  ·  ${resume.email}  ·  ${resume.github}  ·  ${resume.linkedin}`
  );
doc.moveDown(0.8);
doc.moveTo(52, doc.y).lineTo(52 + W, doc.y).strokeColor(LINE).stroke();
doc.moveDown(0.8);

function section(title) {
  doc.font("Helvetica-Bold").fontSize(10).fillColor(ACCENT).text(title.toUpperCase(), { characterSpacing: 1.5 });
  doc.moveDown(0.4);
}

// summary
doc.font("Helvetica").fontSize(9.5).fillColor(INK).text(resume.summary, { lineGap: 2 });
doc.moveDown(1);

// experience
section("Experience");
for (const job of resume.experience) {
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK).text(job.role, { continued: true });
  doc.font("Helvetica").fontSize(9).fillColor(MUTED).text(`   ${job.period}`);
  doc.moveDown(0.25);
  for (const b of job.bullets) {
    doc
      .font("Helvetica")
      .fontSize(9.5)
      .fillColor(INK)
      .text(`-  ${b}`, { indent: 6, lineGap: 1.5 });
    doc.moveDown(0.15);
  }
  doc.moveDown(0.5);
}

// education
section("Education");
doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK).text(resume.education.degree, { continued: true });
doc.font("Helvetica").fontSize(9).fillColor(MUTED).text(`   ${resume.education.period}`);
doc.moveDown(1);

// skills
section("Skills");
for (const [group, items] of resume.skills) {
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(INK).text(`${group}:  `, { continued: true });
  doc.font("Helvetica").fontSize(9.5).fillColor(MUTED).text(items, { lineGap: 1.5 });
  doc.moveDown(0.2);
}
doc.moveDown(0.8);

// beyond the stack
section("Beyond the stack");
doc.font("Helvetica").fontSize(9.5).fillColor(INK).text(resume.beyond, { lineGap: 2 });
doc.moveDown(0.3);
doc.font("Helvetica-Oblique").fontSize(9).fillColor(MUTED).text(resume.site);

doc.end();
console.log("wrote", out);
