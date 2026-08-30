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
  { index: "04", label: "studio", href: "#studio" },
  { index: "05", label: "contact", href: "#contact" },
];

export const sectionTotal = "05";

export const readme = {
  paragraphs: [
    "I'm Neeraj. Fullstack engineer at Qualys by day, tabs-always-open researcher by night. I got into software the way I get into most things - by taking apart something I probably shouldn't have. The first program I wrote failed in an interesting way. I've been chasing that feeling ever since.",
    "The day job is building security platform features: frontends talking to services, Kafka pipelines holding it all together with retry configs and a lot of optimism.",
    "The night work is different. LLM agents that actually do something useful. I'm interested in what happens when you build AI tools for yourself - not demos, not prototypes. Things you actually run.",
    "There's also a violin that gets played most evenings, a sketchbook, and a pair of boots with Himalayan mud still on them. I don't think of these as separate from engineering.",
    "Not everything here is polished - that's intentional. The interesting part of engineering is the bit before you know the answer.",
  ],
  stats: [
    { value: "2 yrs", label: "shipping to prod" },
    { value: "2", label: "Himalayan treks" },
    { value: "∞", label: "debugging hours" },
  ],
  currently: [
    { label: "building", value: "something nobody cares" },
    { label: "practicing", value: "vibrato. parents still patient" },
    {
      label: "planning",
      value: "next trek. before the previous one fades from memory",
    },
    { label: "wondering", value: "is it really worth it?" },
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
      "Core contributor to a data ingestion service using Java / Spring Boot that processes third-party asset and vulnerability feeds for risk calculation and security dashboards",
      "Built a LangChain + RAG-based schema transformation agent that automated mapping of third-party data contracts internal models, eliminating 100+ manual engineering hours per cycle and improving mapping consistency by 85%.",
      "Identified and resolved the leading cause of integration deployment failures by building a centralized configuration management system which decoupled business logic from deployment artifacts.",
      "Designed and built a configuration-driven React micro-frontend supporting 60+ integration-specific workflows with runtime reconfigurability, reducing code complexity by ~90%.",
      "Contributed to FedRAMP High compliance hardening across 6 microservices implementing FIPS-compliant encryption, audit logging, and secret rotation via HashiCorp Vault.",
      "Prototyped a zero-trust data ingestion SDK that isolates partner data streams at the network boundary, ensuring secure third-party integrations.",
    ],
    stack: ["Spring Boot", "React", "Kafka", "Redis", "LangChain"],
  },
  {
    period: "JAN 2024",
    role: "Engineering Intern",
    org: "Qualys",
    notes: [
      "Shipped my first production code and learned the difference between “works on my machine” and “works”.",
      "Discovered that reading other people's code is a skill, the codebase is the real documentation and that people working there also have no idea about what they are doing",
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
  url?: string;
};

export const experiments: Experiment[] = [
  // {
  //   fig: "fig. 01",
  //   name: "recall",
  //   tagline: "A second brain that actually remembers",
  //   description:
  //     "Local-first RAG over my markdown notes. Ollama for embeddings and generation, ChromaDB for vectors, FastAPI in between. Citations or it didn't happen.",
  //   status: "v0.3 · in daily use",
  //   year: "2025",
  //   stack: ["Python", "FastAPI", "ChromaDB", "Ollama"],
  // },
  // {
  //   fig: "fig. 02",
  //   name: "agent-loop",
  //   tagline: "How many agents is too many?",
  //   description:
  //     "A LangGraph playground for multi-agent workflows with human-in-the-loop checkpoints. Mostly an exercise in teaching agents when to stop.",
  //   status: "in progress",
  //   year: "2026",
  //   stack: ["LangGraph", "LangChain", "Anthropic API"],
  // },
  // {
  //   fig: "fig. 03",
  //   name: "homelab",
  //   tagline: "A single-node Kubernetes cluster nobody asked for",
  //   description:
  //     "K8s, Helm, Consul and Vault running on a reclaimed machine in the corner of my room. It hosts my experiments, and my humility.",
  //   status: "forever WIP",
  //   year: "2024 -",
  //   stack: ["Kubernetes", "Helm", "Consul", "Vault"],
  // },
  {
    fig: "fig. 01",
    name: "jigsaw",
    tagline: "A puzzle app that pieces itself together, mostly.",
    description:
      "A multiplayer jigsaw puzzle built on WebRTC, because solving one alone apparently wasn't chaotic enough. Teamwork, questionable piece placement, and mild frustration - all in real time.",
    status: "it works on your machine too",
    year: "2026",
    stack: ["Vite", "WebRTC", "Supabase", "Vercel"],
    url: "https://jigsaw.neerajkulkarni.in",
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
  {
    name: "Ollama",
    group: "ai",
    note: "Local models. My GPU has different opinions.",
  },
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
    topic: "on coding",
    body: "Art is what makes us human, coding just helps me pay the bills",
  },
  {
    id: "002",
    topic: "on frontends",
    body: "CSS IS FUCKING STUPID",
  },
  {
    id: "003",
    topic: "on debugging",
    body: "If you can't reproduce it, you don't have a bug",
  },
  {
    id: "004",
    topic: "on agents",
    body: "An agent is just an expensive while(true) invented by capitalistic corporate evils",
  },
  {
    id: "005",
    topic: "on learning",
    body: "Try to learn everything just to forget everything at the exact moment you need it",
  },
  {
    id: "006",
    topic: "on music",
    body: "Listening to Bhaavgeet, Heavy Metal, Techno and Hindustani Classical depending on the mood",
  },
  {
    id: "007",
    topic: "on trekking",
    body: "Mountains teach you to be humble, very much unlike the rest of my life /s",
  },
  {
    id: "008",
    topic: "on this site",
    body: "Vibe coded this, mostly to find out how the award-winning sites do it.",
  },
];

export const studio = {
  intro: "Jack of all trades - Master at nothing, better than master of one",
  violin: {
    title: "the violin",
    paragraphs: [
      "Just muscle memory and a bow that tells me immediately when I've play a bad note. Thousands of mistakes later, it almost sounds intentional.",
      "Practice taught me more about chasing perfection than any other book: listen to the piece and isolate the broken verse. Then play it at tempo and watch it break differently. YOU JUST CAN'T HAVE IT ALL!",
    ],
    hint: "drag to rotate",
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
  treks: [
    {
      name: "Kuari Pass",
      region: "Garhwal Himalaya",
      elevation: "12,500 ft",
      note: "Two valleys, two climates, one very wet tent.",
    },
    {
      name: "Chandrashila",
      region: "Garhwal Himalaya",
      elevation: "12,500 ft",
      note: "Summit at sunrise. Understood immediately why people keep going back.",
    },
    {
      name: "Forts in Sahyadri",
      region: "Maharashtra",
      elevation: "~4,500 ft",
      note: "Home turf. No signal, plenty of rain - the rain is a feature.",
    },
    {
      name: "Bed to Chair",
      region: "Home",
      elevation: "~3 ft",
      note: "Training for Everest by repeatedly summiting my chair.",
    },
  ],
  outro:
    "also in rotation: I watch films, webseries, play badminton and touch grass occasionally",
};
