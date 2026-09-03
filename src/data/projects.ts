import { Project } from "@/lib/types";
import { STRATOS_URL } from "@/data/stratos";

export const projects: Project[] = [
  {
    slug: "otonom-iha",
    title: "Autonomous Rotary-Wing Multicopter UAV",
    description:
      "Quadcopter built for the TEKNOFEST İnsansız Hava Araçları competition on a Pixhawk 6C / Raspberry Pi 5 / ArduPilot stack with OpenCV target detection. As Electronics & Software Captain I own flight-controller integration, the sensor stack, and autonomous mission planning. 19.76-minute hover endurance, 12 km autonomous range, and precision landing, with a TEKNOFEST rotorcraft final and a NASA Space Apps Turkey final in its first year. Covered by Anadolu Ajansı and Bursa Hakimiyet for public autonomous flight demonstrations.",
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
    links: [{ label: "stratosiha.com", href: STRATOS_URL, isPrimary: true }],
    image: "/images/uav.svg",
    featured: true,
    order: 1,
    status: "IN_PROGRESS",
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
    status: "SHIPPED",
    repo: "iWeslax83/prose",
  },
  {
    slug: "teluvane",
    title: "Teluvane - Agent Accountability",
    description:
      "Multi-tenant compliance auditing platform for AI agents: every LLM call, tool call, and tool result is SHA-256 hash-chained per session, then audited against EU AI Act, ISO 42001, NIST AI RMF, and SOC 2 policy packs by a LangGraph + Claude tribunal, with an MCP server, SDKs, and optional on-chain session anchoring.",
    tag: "AI",
    tagDetail: "live · multi-tenant + EU AI Act",
    techPills: ["LangGraph", "Claude", "FastAPI", "Postgres", "MCP"],
    links: [
      {
        label: "live",
        href: "https://teluvane.com",
        isPrimary: true,
      },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/teluvane",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 3,
    status: "SHIPPED",
    repo: "iWeslax83/teluvane",
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
    status: "SHIPPED",
    repo: "iWeslax83/live-wildfire",
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
    status: "SHIPPED",
    repo: "iWeslax83/tofas-fen-webapp",
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
    status: "SHIPPED",
    repo: "iWeslax83/stratos-akademi",
  },
  {
    slug: "masa-hesaplari",
    title: "Masa Hesapları",
    description:
      "QR-code table-ordering and bill-splitting web app for restaurants. The customer scans the table QR, browses a localized menu, orders, and splits the check by item, evenly, or in full. A 12-table Postgres schema (Drizzle ORM on Neon) covers table sessions, orders, split-payment item locks, and waiter calls, with role-based panels for admin, waiter, and kitchen. Live order status streams to the customer over server-sent events; card payments run through iyzico alongside fast-IBAN and cash flows. Turkish/English i18n via a locale cookie keeps printed QR links valid across languages, with allergen/diet filtering over 7 fixed tags, JWT auth, and a daily cron that flags unpaid tables.",
    tag: "full-stack",
    tagDetail: "2026 · Next.js 16 + Neon",
    techPills: ["Next.js 16", "React 19", "Drizzle ORM", "Neon Postgres", "TypeScript"],
    links: [],
    featured: false,
    order: 7,
    status: "SHIPPED",
  },
  {
    slug: "duran",
    title: "DurAn",
    description:
      "TEKNOFEST finalist (Bağımlılıklarla Mücadelede Teknolojik Uygulamalar Yarışması), built as team captain of Stratos Root. A two-part early-warning system for gambling relapse: an ESP32S3 wristband (MAX30102 PPG, GSR, MPU6050, DS18B20) fused on-device with a React Native app's behavioral signal to detect craving spikes inside a 3-minute window. Fully on-device, no server, no stored raw data, only event timestamps persisted. 94% detection accuracy against simulated relapse events, 14 passing unit tests across the physiological and behavioral pipelines, behind a three-tier escalating intervention flow (nudge, pause screen, breathing exercise + YEDAM hotline).",
    tag: "AI",
    tagDetail: "TEKNOFEST Finalist · ESP32S3 + React Native",
    techPills: ["React Native", "TypeScript", "ESP32S3", "Bluetooth LE"],
    links: [],
    featured: false,
    order: 8,
    status: "IN_PROGRESS",
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
    order: 9,
    status: "ARCHIVED",
  },
  {
    slug: "local-ai-assistant",
    title: "Local AI Assistant",
    description:
      'WhatsApp-based "Jarvis" running Llama 3.1 8B locally on an RTX 3060 Ti - task management, calendar, habit tracking, expense tracking, and a mood journal, all on-device. Under 800ms average response latency, used daily for over 6 months.',
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
    order: 10,
    status: "IN_PROGRESS",
    repo: "iWeslax83/local-ai-assistant",
  },
  {
    slug: "zero-g-pharma",
    title: "Zero-G Pharma",
    description:
      "Drug-crystal growth simulator comparing microgravity vs Earth gravity. Winner, Türkiye - NASA Space Apps Challenge 2025, advancing to the global top 50 of 6,000+ teams.",
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
    order: 11,
    status: "IN_PROGRESS",
    repo: "iWeslax83/zero-g-pharma-simulator",
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
    order: 12,
    status: "SHIPPED",
    repo: "iWeslax83/stratos-website",
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
    order: 13,
    status: "ARCHIVED",
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
    order: 14,
    status: "ARCHIVED",
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
    order: 15,
    status: "SHIPPED",
  },
];

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);
export const secondaryProjects = projects
  .filter((p) => !p.featured)
  .sort((a, b) => a.order - b.order);
