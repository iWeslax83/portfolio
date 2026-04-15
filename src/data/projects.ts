import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "otonom-iha",
    title: "Autonomous Rotary-Wing Multicopter UAV",
    description:
      "Autonomous quadcopter for Teknofest Liseler Arası İnsansız Hava Araçları Yarışması. Custom-built UAV with autonomous flight, precision navigation, and mission execution capabilities. Electronics & Software Captain — responsible for flight controller integration, sensor systems, and autonomous mission planning.",
    tag: "competition",
    tagDetail: "TEKNOFEST 2026 · Rotary-Wing",
    techPills: ["autonomous flight", "flight controller", "navigation", "electronics", "machine learning"],
    links: [],
    featured: true,
    order: 1,
  },
  {
    slug: "tofas-fen-webapp",
    title: "Tofaş Fen Webapp",
    description:
      "Production school management system. 22 MongoDB models, 6 user roles, JWT + 2FA auth, GraphQL, WebSocket, Kubernetes deployment.",
    tag: "full-stack",
    tagDetail: "open source",
    techPills: ["React 19", "Express", "MongoDB", "K8s"],
    links: [{ label: "source code", href: "https://github.com/iWeslax83/tofas-fen-webapp", isPrimary: true },],
    featured: true,
    order: 2,
  },
  {
    slug: "local-ai-assistant",
    title: "Local AI Assistant",
    description:
      'WhatsApp-based "Jarvis" running Llama 3.1 8B locally on RTX 3060 Ti. Task management, calendar, habit tracking, expense tracking, mood journal.',
    tag: "AI",
    tagDetail: "open source",
    techPills: ["Python", "FastAPI", "Ollama"],
    links: [
      { label: "source code", href: "https://github.com/iWeslax83/local-ai-assistant", isPrimary: true },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "genesis",
    title: "Genesis",
    description: "Closed-loop space agriculture life support simulator for TUA Astro Hackathon.",
    tag: "hackathon",
    tagDetail: "TUA Astro 2026",
    techPills: ["JavaScript", "AI prediction", "Biology-based"],
    links: [
      { label: "live demo", href: "https://genesis-nu-flame.vercel.app", isPrimary: true },
      { label: "source code", href: "https://github.com/iWeslax83/Genesis", isPrimary: false },
    ],
    featured: false,
    order: 4,
  },
  {
    slug: "tmt-website",
    title: "TMT Website",
    description: "Official website for TMT — team showcase and project pages.",
    tag: "web",
    tagDetail: "Next.js · Team showcase",
    techPills: ["Next.js", "Tailwind", "Advertisement"],
    links: [{ label: "live", href: "https://tfltmt-website.vercel.app", isPrimary: true }],
    featured: false,
    order: 5,
  },
  {
    slug: "fpv-drone",
    title: "FPV Drone",
    description: "FPV UAV for MEB Robot competition with real-time video transmission.",
    tag: "competition",
    tagDetail: "MEB Robot · FPV racing",
    techPills: ["FPV", "electronics"],
    links: [],
    featured: false,
    order: 6,
  },
  {
    slug: "vex-robotics",
    title: "VEX Robotics",
    description: "Competition-level robot with custom mechanical design and sensor integration.",
    tag: "competition",
    tagDetail: "V5 Pushback · Competition",
    techPills: ["VEX V5", "sensors"],
    links: [],
    featured: false,
    order: 7,
  },
  {
    slug: "zero-g-pharma",
    title: "Zero-G Pharma",
    description: "Space drug crystal growth simulator in microgravity vs Earth gravity, Top 5 in Turkey NASA Space Apps Challange 2025.",
    tag: "simulation",
    tagDetail: "Python · VPython 3D sim",
    techPills: ["Python", "VPython"],
    links: [
      { label: "source code", href: "https://github.com/iWeslax83/zero-g-pharma-simulator", isPrimary: false },
    ],
    featured: false,
    order: 8,
  },
];

export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
export const secondaryProjects = projects.filter((p) => !p.featured).sort((a, b) => a.order - b.order);
