import { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "otonom-iha",
    title: "Otonom Döner Kanat İHA",
    description:
      "Autonomous quadcopter for Teknofest Liseler Arası İnsansız Hava Araçları Yarışması. Custom-built UAV with autonomous flight, precision navigation, and mission execution capabilities. Electronics & Software Captain — responsible for flight controller integration, sensor systems, and autonomous mission planning.",
    descriptionTr:
      "Teknofest Liseler Arası İnsansız Hava Araçları Yarışması için otonom quadcopter. Otonom uçuş, hassas navigasyon ve görev yürütme yeteneklerine sahip özel yapım İHA. Elektronik & Yazılım Kaptanı — uçuş kontrol entegrasyonu, sensör sistemleri ve otonom görev planlamasından sorumlu.",
    tag: "competition",
    tagDetail: "TEKNOFEST 2026 · Rotary-Wing",
    techPills: ["autonomous flight", "flight controller", "sensor fusion", "navigation", "CAD design"],
    links: [{ label: "case study", href: "#", isPrimary: true }],
    image: "/images/uav.webp",
    featured: true,
    order: 1,
  },
  {
    slug: "tofas-fen-webapp",
    title: "Tofaş Fen Webapp",
    description:
      "Production school management system. 22 MongoDB models, 6 user roles, JWT + 2FA auth, GraphQL, WebSocket, Kubernetes deployment.",
    descriptionTr:
      "Üretim düzeyinde okul yönetim sistemi. 22 MongoDB modeli, 6 kullanıcı rolü, JWT + 2FA kimlik doğrulama, GraphQL, WebSocket, Kubernetes dağıtımı.",
    tag: "full-stack",
    tagDetail: "private repo",
    techPills: ["React 19", "Express", "MongoDB", "K8s"],
    links: [{ label: "case study", href: "#", isPrimary: false }],
    featured: true,
    order: 2,
  },
  {
    slug: "local-ai-assistant",
    title: "Local AI Assistant",
    description:
      'WhatsApp-based "Jarvis" running Llama 3.1 8B locally on RTX 3060 Ti. Task management, calendar, habit tracking, expense tracking, mood journal.',
    descriptionTr:
      'RTX 3060 Ti üzerinde yerel olarak Llama 3.1 8B çalıştıran WhatsApp tabanlı "Jarvis". Görev yönetimi, takvim, alışkanlık takibi, harcama takibi, ruh hali günlüğü.',
    tag: "AI",
    tagDetail: "open source",
    techPills: ["Python", "FastAPI", "Ollama", "61 tests"],
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
    descriptionTr: "TUA Astro Hackathon için kapalı döngü uzay tarımı yaşam destek simülatörü.",
    tag: "hackathon",
    tagDetail: "TUA Astro 2026",
    techPills: ["JavaScript", "AI prediction"],
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
    descriptionTr: "TMT resmi web sitesi — takım tanıtımı ve proje sayfaları.",
    tag: "web",
    tagDetail: "Next.js · Team showcase",
    techPills: ["Next.js", "Tailwind"],
    links: [{ label: "live", href: "https://tfltmt-website.vercel.app", isPrimary: true }],
    featured: false,
    order: 5,
  },
  {
    slug: "fpv-drone",
    title: "FPV Drone",
    description: "FPV UAV for MEB Robot competition with real-time video transmission.",
    descriptionTr: "MEB Robot yarışması için gerçek zamanlı video aktarımlı FPV İHA.",
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
    descriptionTr: "Özel mekanik tasarım ve sensör entegrasyonuna sahip yarışma düzeyinde robot.",
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
    description: "Space drug crystal growth simulator in microgravity vs Earth gravity.",
    descriptionTr: "Mikro yerçekimi ve Dünya yerçekiminde uzay ilaç kristal büyüme simülatörü.",
    tag: "simulation",
    tagDetail: "Python · VPython 3D sim",
    techPills: ["Python", "VPython"],
    links: [
      { label: "source code", href: "https://github.com/iWeslax83/zero-g-pharma-simulator", isPrimary: false },
    ],
    featured: false,
    order: 8,
  },
  {
    slug: "things-in-2045",
    title: "Things in 2045",
    description: "Interactive future technology presentation with AI-powered insights.",
    descriptionTr: "Yapay zeka destekli içgörülerle interaktif gelecek teknolojisi sunumu.",
    tag: "presentation",
    tagDetail: "Next.js · Interactive pres.",
    techPills: ["Next.js", "Web Audio"],
    links: [],
    featured: false,
    order: 9,
  },
];

export const featuredProjects = projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
export const secondaryProjects = projects.filter((p) => !p.featured).sort((a, b) => a.order - b.order);
