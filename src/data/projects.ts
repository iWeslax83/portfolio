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
    slug: "tofas-fen-webapp",
    title: "Tofaş Fen Webapp",
    description:
      "Production school-management platform. 22 MongoDB models, 6 user roles, JWT + 2FA auth, GraphQL, WebSocket realtime, and a Kubernetes deployment.",
    tag: "full-stack",
    tagDetail: "open source",
    techPills: ["React 19", "Express", "MongoDB", "GraphQL", "K8s"],
    links: [
      {
        label: "source code",
        href: "https://github.com/iWeslax83/tofas-fen-webapp",
        isPrimary: true,
      },
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "local-ai-assistant",
    title: "Local AI Assistant",
    description:
      'WhatsApp-based "Jarvis" running Llama 3.1 8B locally on an RTX 3060 Ti - task management, calendar, habit tracking, expense tracking, and a mood journal, all on-device.',
    tag: "AI",
    tagDetail: "open source",
    techPills: ["Python", "FastAPI", "Ollama"],
    links: [
      {
        label: "source code",
        href: "https://github.com/iWeslax83/local-ai-assistant",
        isPrimary: true,
      },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "stratos-website",
    title: "STRATOS İHA - Website",
    description:
      "Official site for STRATOS İHA, the TEKNOFEST UAV community I founded. Team showcase, departments, and project pages.",
    tag: "web",
    tagDetail: "live · Next.js",
    techPills: ["Next.js", "TypeScript", "Tailwind"],
    links: [
      { label: "live", href: "https://stratosiha.vercel.app", isPrimary: true },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/iha-website",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 4,
  },
  {
    slug: "izin-sistemi",
    title: "İzin Sistemi",
    description:
      "Permission and leave-management system for the Tofaş Fen Innovation Workshop - request flows, approvals, and tracking.",
    tag: "full-stack",
    tagDetail: "live",
    techPills: ["JavaScript", "Node.js"],
    links: [
      { label: "live", href: "https://izinsistemi.vercel.app", isPrimary: true },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/izinsistemi",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 5,
  },
  {
    slug: "genesis",
    title: "Genesis",
    description:
      "Closed-loop space-agriculture life-support simulator built for the TUA Astro Hackathon - biology-driven modelling with AI prediction.",
    tag: "hackathon",
    tagDetail: "TUA Astro 2026",
    techPills: ["JavaScript", "AI prediction", "simulation"],
    links: [
      {
        label: "live demo",
        href: "https://genesis-nu-flame.vercel.app",
        isPrimary: true,
      },
      {
        label: "source code",
        href: "https://github.com/iWeslax83/Genesis",
        isPrimary: false,
      },
    ],
    featured: true,
    order: 6,
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
        isPrimary: false,
      },
    ],
    featured: false,
    order: 7,
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
    order: 8,
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
    order: 9,
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
    order: 10,
  },
];

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order);
export const secondaryProjects = projects
  .filter((p) => !p.featured)
  .sort((a, b) => a.order - b.order);
