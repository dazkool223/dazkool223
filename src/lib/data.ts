/**
 * Every word on the site lives here. Edit this file, not the components.
 */

export const profile = {
  name: "Neeraj Kulkarni",
  initials: "NK",
  role: "Fullstack Software Engineer",
  org: "Qualys",
  location: "Pune, IN",
  timezone: "Asia/Kolkata",
  // TODO(neeraj): swap in your real links + email
  email: "nvkulkarni.1108@gmail.com",
  github: "https://github.com/dazkool223",
  linkedin: "https://www.linkedin.com/in/neeraj-kulkarni-223",
  resume: "/resume.pdf",
};

export const nav = [
  { index: "01", label: "readme", href: "#readme" },
  { index: "02", label: "worklog", href: "#worklog" },
  { index: "03", label: "experiments", href: "#experiments" },
  { index: "04", label: "toolbench", href: "#toolbench" },
  { index: "05", label: "notes", href: "#field-notes" },
  { index: "06", label: "journal", href: "#journal" },
  { index: "07", label: "studio", href: "#studio" },
  { index: "08", label: "arcade", href: "#arcade" },
  { index: "09", label: "contact", href: "#contact" },
];

export const sectionTotal = "09";

export const readme = {
  paragraphs: [
    "I'm Neeraj - a fullstack engineer at Qualys who got into software the same way I get into everything: by taking it apart to see why it works. The first program I ever wrote failed in an interesting way, and I've been chasing that feeling ever since.",
    "By day I build security platform features - React micro frontends talking to Spring Boot services, with Kafka somewhere in the middle doing the heavy lifting. By night the laptop stays open: LLM agents, retrieval pipelines, and a homelab held together by Helm charts and optimism.",
    "But the keyboard is only half of it. There's a violin that gets played most evenings, a sketchbook full of graphite, and a pair of boots that have been up more Himalayan trails than I can justify. The same curiosity drives all of it - code just happens to be the part that pays.",
    "I keep this site like a lab notebook. Not everything in it is polished - that's the point. The interesting part of engineering is the part where you don't know the answer yet.",
  ],
  currently: [
    { label: "building", value: "a local-first RAG over my own notes" },
    { label: "reading", value: "Designing Data-Intensive Applications, again" },
    { label: "practicing", value: "vibrato. the neighbours are patient" },
    { label: "planning", value: "the next trek before the last one fades" },
    { label: "wondering", value: "when an agent should refuse to act" },
  ],
};

export type WorklogEntry = {
  period: string;
  role: string;
  org: string;
  notes: string[];
  stack?: string[];
};

export const worklog: WorklogEntry[] = [
  {
    period: "JUL 2024 - NOW",
    role: "Fullstack Software Engineer",
    org: "Qualys",
    notes: [
      "Building micro frontends with Module Federation across a security platform used by enterprises - independent deploys, one seamless runtime.",
      "Designing Spring Boot services, Kafka pipelines and Redis caching: the unglamorous plumbing that makes dashboards feel instant.",
      "Prototyping LLM-assisted features - retrieval over product knowledge with LangChain, ChromaDB and a healthy distrust of vector similarity.",
    ],
    stack: [
      "React",
      "Module Federation",
      "Spring Boot",
      "Kafka",
      "Redis",
      "LangChain",
    ],
  },
  {
    period: "JAN 2024",
    role: "Engineering Intern",
    org: "Qualys",
    notes: [
      "Shipped my first production code and learned the difference between “works on my machine” and “works”.",
      "Discovered that reading other people's code is a skill, and that the codebase is the real documentation.",
    ],
    stack: ["Java", "JUnit", "Oracle SQL", "Git"],
  },
  {
    period: "2020 - 2024",
    role: "BE, Engineering",
    org: "Savitribai Phule Pune University",
    notes: [
      "Where the curiosity got structure. Also where I learned that the best way to understand a concept is to build a bad version of it first.",
    ],
  },
];

export type Experiment = {
  fig: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  year: string;
  stack: string[];
};

export const experiments: Experiment[] = [
  {
    fig: "fig. 01",
    name: "recall",
    tagline: "A second brain that actually remembers",
    description:
      "Local-first RAG over my markdown notes. Ollama for embeddings and generation, ChromaDB for vectors, FastAPI in between. Citations or it didn't happen.",
    status: "v0.3 · in daily use",
    year: "2025",
    stack: ["Python", "FastAPI", "ChromaDB", "Ollama"],
  },
  {
    fig: "fig. 02",
    name: "agent-loop",
    tagline: "How many agents is too many?",
    description:
      "A LangGraph playground for multi-agent workflows with human-in-the-loop checkpoints. Mostly an exercise in teaching agents when to stop.",
    status: "in progress",
    year: "2026",
    stack: ["LangGraph", "LangChain", "Anthropic API"],
  },
  {
    fig: "fig. 03",
    name: "homelab",
    tagline: "A single-node Kubernetes cluster nobody asked for",
    description:
      "K8s, Helm, Consul and Vault running on a reclaimed machine in the corner of my room. It hosts my experiments, and my humility.",
    status: "forever WIP",
    year: "2024 -",
    stack: ["Kubernetes", "Helm", "Consul", "Vault"],
  },
  {
    fig: "fig. 04",
    name: "fragment",
    tagline: "Micro frontends without tears",
    description:
      "A Module Federation starter kit: shared design tokens, independent deploys, one runtime. Born from production scar tissue.",
    status: "v1.0",
    year: "2025",
    stack: ["React", "Module Federation", "TypeScript", "Jest"],
  },
];

export type Tool = {
  name: string;
  group: string;
  note: string;
};

export const toolbench: Tool[] = [
  // languages
  {
    name: "TypeScript",
    group: "languages",
    note: "The compiler is my first code reviewer.",
  },
  {
    name: "Java",
    group: "languages",
    note: "Verbose, dependable, pays the bills.",
  },
  {
    name: "Python",
    group: "languages",
    note: "The duct tape of my AI experiments.",
  },
  {
    name: "JavaScript",
    group: "languages",
    note: "Where it all started. `this` still surprises me.",
  },
  // frontend
  {
    name: "React",
    group: "frontend",
    note: "I think in components now. Can't undo it.",
  },
  {
    name: "Next.js",
    group: "frontend",
    note: "What this very site is built on. v16, app router.",
  },
  {
    name: "Redux Toolkit",
    group: "frontend",
    note: "State management without the boilerplate guilt.",
  },
  {
    name: "Micro Frontends",
    group: "frontend",
    note: "Conway's law, but make it deployable.",
  },
  {
    name: "Module Federation",
    group: "frontend",
    note: "Independent deploys, one runtime. Magic with footguns.",
  },
  {
    name: "Jest",
    group: "frontend",
    note: "Red, green, refactor. Mostly red at first.",
  },
  // backend
  {
    name: "Spring Boot",
    group: "backend",
    note: "Annotations all the way down.",
  },
  {
    name: "FastAPI",
    group: "backend",
    note: "The fastest path from idea to endpoint.",
  },
  {
    name: "Apache Kafka",
    group: "backend",
    note: "Partitions are not queues. Took me a while.",
  },
  {
    name: "Redis",
    group: "backend",
    note: "The answer to “why is this slow?” surprisingly often.",
  },
  {
    name: "PostgreSQL",
    group: "backend",
    note: "The default. Boring in the best way.",
  },
  {
    name: "Oracle SQL",
    group: "backend",
    note: "Enterprise-grade. Character-building.",
  },
  {
    name: "Liquibase",
    group: "backend",
    note: "Schema changes with a paper trail.",
  },
  {
    name: "Supabase",
    group: "backend",
    note: "Postgres in a trench coat, and I love it.",
  },
  {
    name: "JUnit",
    group: "backend",
    note: "If it isn't tested, it's a rumor.",
  },
  // ai / ml
  {
    name: "LangChain",
    group: "ai",
    note: "Chains, prompts, and occasional chaos.",
  },
  {
    name: "LangGraph",
    group: "ai",
    note: "Agents as state machines. Finally, exit conditions.",
  },
  {
    name: "RAG",
    group: "ai",
    note: "Retrieval is a ranking problem in a database costume.",
  },
  {
    name: "ChromaDB",
    group: "ai",
    note: "Where my embeddings sleep at night.",
  },
  { name: "Ollama", group: "ai", note: "Local models. My GPU has opinions." },
  {
    name: "Hugging Face",
    group: "ai",
    note: "The library of Alexandria, but for weights.",
  },
  {
    name: "OpenAI",
    group: "ai",
    note: "Good APIs make hard things look easy.",
  },
  {
    name: "Anthropic LLMs",
    group: "ai",
    note: "Claude helped review this site. It approves.",
  },
  // infra
  {
    name: "Kubernetes",
    group: "infra",
    note: "Declarative infrastructure, imperative debugging.",
  },
  {
    name: "Docker",
    group: "infra",
    note: "Works on my machine - now everyone's machine.",
  },
  { name: "Helm", group: "infra", note: "Templated YAML. Forgive me." },
  {
    name: "Consul",
    group: "infra",
    note: "Services finding each other in the dark.",
  },
  {
    name: "Vault",
    group: "infra",
    note: "Dynamic credentials feel mildly illegal.",
  },
  { name: "Jenkins", group: "infra", note: "Old, grumpy, gets the job done." },
  { name: "Git", group: "infra", note: "My actual time machine." },
];

export const toolGroups = [
  { id: "languages", label: "Languages" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI / ML" },
  { id: "infra", label: "Infra" },
];

export type FieldNote = {
  id: string;
  topic: string;
  body: string;
};

export const fieldNotes: FieldNote[] = [
  {
    id: "001",
    topic: "on kafka",
    body: "Partitions aren't queues. Consumer groups finally clicked the day I stopped pretending they were.",
  },
  {
    id: "002",
    topic: "on retrieval",
    body: "Vector similarity is not relevance. Skipping the reranker is how RAG demos die in production.",
  },
  {
    id: "003",
    topic: "on secrets",
    body: "Vault's dynamic database credentials expire before the standup ends. This still feels like magic.",
  },
  {
    id: "004",
    topic: "on frontends",
    body: "Every micro frontend boundary is an org-chart decision in disguise. Conway was right.",
  },
  {
    id: "005",
    topic: "on debugging",
    body: "If you can't reproduce it, you don't have a bug - you have a ghost story.",
  },
  {
    id: "006",
    topic: "on agents",
    body: "An agent without an exit condition is just an expensive while(true).",
  },
  {
    id: "007",
    topic: "on learning",
    body: "Reading the docs end-to-end is a superpower disguised as a chore.",
  },
  {
    id: "008",
    topic: "on this site",
    body: "Built with Next.js 16, GSAP and three.js - mostly to find out how the award-winning sites do it.",
  },
  {
    id: "009",
    topic: "on violin",
    body: "Vibrato is controlled instability. So is most production infrastructure.",
  },
  {
    id: "010",
    topic: "on trekking",
    body: "Mountains teach pacing. You don't summit by sprinting the first kilometre.",
  },
];

export const studio = {
  intro:
    "The part of me that doesn't compile. An engineer is the worst thing to be full-time - so I'm not.",
  violin: {
    title: "the violin",
    paragraphs: [
      "The oldest project I maintain. No version control, no logs, no rollback - just muscle memory and a bow that tells me immediately when I've shipped a bad note.",
      "Practice taught me more about debugging than any book: slow the passage down, isolate the broken bar, listen before you fix. Then play it at tempo and watch it break differently.",
    ],
    hint: "drag to rotate - no model file, just bézier curves and three.js",
  },
  sketches: [
    // TODO(neeraj): scan your sketches into /public/art and update these
    {
      src: "/art/sketch-01.svg",
      title: "ridge line, from memory",
      note: "graphite · 2B",
    },
    {
      src: "/art/sketch-02.svg",
      title: "the violin, again",
      note: "graphite · 4B",
    },
    {
      src: "/art/sketch-03.svg",
      title: "old city window",
      note: "graphite · HB",
    },
  ],
  // TODO(neeraj): replace with your actual treks + numbers
  treks: [
    {
      name: "Kedarkantha",
      region: "Garhwal Himalaya",
      elevation: "12,500 ft",
      note: "Summit at sunrise. Understood immediately why people keep going back.",
    },
    {
      name: "Hampta Pass",
      region: "Himachal",
      elevation: "14,100 ft",
      note: "Two valleys, two climates, one very wet tent.",
    },
    {
      name: "Triund",
      region: "Dharamkot",
      elevation: "9,350 ft",
      note: "The starter trek that started everything.",
    },
    {
      name: "Monsoon forts",
      region: "Western Ghats",
      elevation: "~4,500 ft",
      note: "Home turf. No signal, plenty of fog - the fog is a feature.",
    },
  ],
  outro:
    "also in rotation: film scores while coding, old laptops reborn as linux servers, and a learning queue that only grows.",
};
