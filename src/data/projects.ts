import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "otonom-iha",
    title: "Autonomous Rotary-Wing Multicopter UAV",
    description:
      "Quadcopter built for the TEKNOFEST İnsansız Hava Araçları competition. Autonomous flight, precision navigation, and computer-vision target detection. As Electronics & Software Captain I own flight-controller integration, the sensor stack, and autonomous mission planning.",
    tag: "competition",
    tagDetail: "TEKNOFEST 2026 · Rotary-Wing",
    techPills: [
      "embedded systems",
      "autonomous flight",
      "flight controller",
      "computer vision",
      "PCB design",
      "machine learning",
    ],
    links: [],
    image: "/images/uav.svg",
    featured: true,
    order: 1,
  },
  {
    slug: "prose",
    title: "PROSE - Intent-First Programming",
    description:
      "Compiles one sentence of natural language into a typed, versioned agent task-graph, then executes it step by step with verify gates, retries, idempotency, and a live trace you can replay deterministically. The model only emits a step list; the engine owns ids, edges, typing, and the checksum, so a sloppy model cannot produce an invalid graph.",
    tag: "AI",
    tagDetail: "live · typed agent task-graphs",
    techPills: ["Next.js", "TypeScript", "Zod", "agent tooling"],
    links: [
      { label: "live", href: "https://prose-eight.vercel.app", isPrimary: true },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/prose",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "blackbox",
    title: "Blackbox - Agent Accountability",
    description:
      "Flight recorder and autonomous compliance tribunal for AI agents: a tamper-evident audit log, a multi-agent EU AI Act policy tribunal, and auditor-ready evidence packs.",
    tag: "AI",
    tagDetail: "live · LangGraph + Claude",
    techPills: ["LangGraph", "Claude", "FastAPI", "Python"],
    links: [
      {
        label: "live",
        href: "https://blackbox-agent-accountability.vercel.app",
        isPrimary: true,
      },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/blackbox-agent-accountability",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "live-wildfire",
    title: "Wildfire Spread Forecast Map",
    description:
      "Pulls real active fires from NASA FIRMS onto a world map. Click one and it takes that fire's wind, terrain slope, fuel cover, and humidity and animates where it spreads over the next 12 to 24 hours. The engine is a simplified Alexandridis (2008) cellular-automata model running in a Web Worker.",
    tag: "simulation",
    tagDetail: "live · GDG Çadırlı Hackathon",
    techPills: ["Next.js", "TypeScript", "MapLibre GL", "Web Worker", "NASA FIRMS"],
    links: [
      { label: "live", href: "https://live-wildfire.vercel.app", isPrimary: true },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/live-wildfire",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 4,
  },
  {
    slug: "tofas-fen-webapp",
    title: "Tofaş Fen Webapp",
    description:
      "Production school-management platform. 22 MongoDB models, 6 user roles, JWT + 2FA auth, GraphQL, WebSocket realtime, and a Kubernetes deployment.",
    tag: "full-stack",
    tagDetail: "live · React 19 + K8s",
    techPills: ["React 19", "Express", "MongoDB", "GraphQL", "K8s"],
    links: [
      {
        label: "live",
        href: "https://tofas-fen-webapp.vercel.app",
        isPrimary: true,
      },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/tofas-fen-webapp",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 5,
  },
  {
    slug: "stratos-akademi",
    title: "Stratos Akademi",
    description:
      "Video training platform I built for my own UAV club. Curriculum tree, anti-skip video completion, server-scored quizzes, practical task review with captain feedback, leaderboard, and printable certificates. A cron job proposes new lessons from YouTube; a human always makes the call.",
    tag: "full-stack",
    tagDetail: "live · Next.js 16 + Supabase",
    techPills: ["Next.js 16", "Supabase", "Postgres RLS", "Server Actions", "Vitest"],
    links: [
      {
        label: "live",
        href: "https://stratos-akademi.vercel.app",
        isPrimary: true,
      },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/stratos-akademi",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 6,
  },
  {
    slug: "smart-cane",
    title: "Smart Cane Assistant",
    description:
      "Mount a phone on a white cane and it runs MediaPipe object detection on-device, announcing obstacles at head and chest height in Turkish with a proximity beep. The cane finds what is near the ground; this covers what it misses. No camera frame leaves the phone.",
    tag: "AI",
    tagDetail: "GDG Hackathon Bursa 2026",
    techPills: ["MediaPipe", "React 19", "Vite PWA", "on-device inference"],
    links: [],
    featured: false,
    order: 7,
  },
  {
    slug: "local-ai-assistant",
    title: "Local AI Assistant",
    description:
      'WhatsApp-based "Jarvis" running Llama 3.1 8B locally on an RTX 3060 Ti - task management, calendar, habit tracking, expense tracking, and a mood journal, all on-device.',
    tag: "AI",
    tagDetail: "Llama 3.1 8B · on-device",
    techPills: ["Python", "FastAPI", "Ollama"],
    links: [
      {
        label: "source code",
        href: "https://github.com/iWeslax83/local-ai-assistant",
        isPrimary: true,
      },
    ],
    featured: false,
    order: 8,
  },
  {
    slug: "zero-g-pharma",
    title: "Zero-G Pharma",
    description:
      "Drug-crystal growth simulator comparing microgravity vs Earth gravity. Winner, Türkiye - NASA Space Apps Challenge 2025.",
    tag: "simulation",
    tagDetail: "Winner TR · NASA Space Apps 2025",
    techPills: ["Python", "VPython"],
    links: [
      {
        label: "source code",
        href: "https://github.com/iWeslax83/zero-g-pharma-simulator",
        isPrimary: true,
      },
    ],
    featured: false,
    order: 9,
  },
  {
    slug: "stratos-website",
    title: "STRATOS İHA - Website",
    description:
      "Official site for STRATOS İHA, the TEKNOFEST UAV community I founded. Team showcase, departments, and project pages.",
    tag: "web",
    tagDetail: "live · stratosiha.com",
    techPills: ["Next.js", "TypeScript", "Tailwind"],
    links: [
      { label: "live", href: "https://www.stratosiha.com", isPrimary: true },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/stratos-website",
        isPrimary: false,
      },
    ],
    featured: false,
    order: 10,
  },
  {
    slug: "fpv-drone",
    title: "FPV Drone",
    description: "FPV UAV for the MEB Robot competition with real-time video transmission.",
    tag: "competition",
    tagDetail: "MEB Robot · FPV racing",
    techPills: ["FPV", "electronics"],
    links: [],
    featured: false,
    order: 11,
  },
  {
    slug: "vex-robotics",
    title: "VEX Robotics",
    description: "Competition robot with custom mechanical design and sensor integration.",
    tag: "competition",
    tagDetail: "V5 Pushback",
    techPills: ["VEX V5", "sensors"],
    links: [],
    featured: false,
    order: 12,
  },
  {
    slug: "tmt-website",
    title: "TMT Website",
    description: "Official website for TMT - team showcase and project pages.",
    tag: "web",
    tagDetail: "Next.js · Team showcase",
    techPills: ["Next.js", "Tailwind"],
    links: [{ label: "live", href: "https://tfltmt-website.vercel.app", isPrimary: true }],
    featured: false,
    order: 13,
  },
];

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);
export const secondaryProjects = projects
  .filter((p) => !p.featured)
  .sort((a, b) => a.order - b.order);
