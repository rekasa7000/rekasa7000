/**
 * career-data.ts
 * Single source of truth for all career, education, and project data.
 * The 2-D galaxy, 3-D galaxy, and homepage all derive their data from here.
 */

// ── Shared types ──────────────────────────────────────────────────────────────

export type BodyKind = "work" | "education" | "project";

export type TechSatellite = {
  label: string;
  color: string;
  orbitR: number;
  speed: number;
  offset: number;
  size?: number;
};

export type CareerEntry = {
  id: string;
  kind: BodyKind;
  shortName?: string;   // abbreviated label used in galaxy views

  // ── Textual content ───────────────────────────────────────────────────────
  name: string;         // display name (planet label)
  title: string;        // role / degree / tagline
  sub?: string;         // org + location (2-D info card sub-title)
  period?: string;
  shortDesc: string[];  // 3–6 bullet lines → galaxy info panels
  homeTitle?: string;   // title override for homepage projects list
  homeDesc: string;     // single prose line → homepage projects list
  homeBullets: string[];// detailed paragraphs → homepage experience timeline
  showOnHome?: boolean; // false = galaxy only, not shown on homepage
  github?: string;
  technologies: string[];

  // ── Texture ───────────────────────────────────────────────────────────────
  tex: string;          // e.g. "/planets/2k_mars.jpg"
  ringTex?: string;     // ring-plane texture (BPSU only)

  // ── 2-D canvas visual ─────────────────────────────────────────────────────
  worldX: number;
  worldY: number;
  color: string;        // CSS hex "#rrggbb"
  radius: number;       // canvas pixels
  hasRing?: boolean;
  satellites: TechSatellite[];

  // ── 3-D Three.js visual ───────────────────────────────────────────────────
  color3d: number;      // Three.js hex, e.g. 0x4a90e2
  emissive: number;
  size3d: number;
  orbitRadius: number;
  speed3d: number;
  inc: number;
  rotY: number;
};

// ── Master entry list ─────────────────────────────────────────────────────────

export const ENTRIES: CareerEntry[] = [

  // ── Work ──────────────────────────────────────────────────────────────────

  {
    id: "kloudtech-intern",
    kind: "work",
    name: "Kloudtech Corp",
    shortName: "Kloudtech",
    title: "Software Engineering Intern",
    sub: "Kloudtech Corporation · Balanga City, Bataan",
    period: "Oct 2023 – Jun 2024",
    tex: "/planets/2k_mars.jpg",
    shortDesc: [
      "Software Engineering Intern | Oct 2023 – Jun 2024",
      "IoT platform development and cybersecurity",
      "Enhanced and maintained company web application",
      "Gained hands-on embedded systems experience",
    ],
    homeDesc: "Software engineering internship focused on IoT systems, cybersecurity, and web application development.",
    homeBullets: [
      "Gained hands-on experience with IoT systems and applied cybersecurity practices.",
      "Enhanced and maintained the company's web application and optimized the codebase.",
    ],
    github: undefined,
    technologies: ["TypeScript", "React", "IoT", "Cybersecurity"],
    worldX: 3500, worldY: -80,
    color: "#5a9060", radius: 65,
    satellites: [
      { label: "TypeScript", color: "#3b82f6", orbitR: 96,  speed: 0.44, offset: 0.0 },
      { label: "React",      color: "#61dafb", orbitR: 108, speed: 0.36, offset: 1.5 },
      { label: "AWS",        color: "#ff9900", orbitR: 120, speed: 0.28, offset: 3.0 },
      { label: "Docker",     color: "#2496ed", orbitR: 82,  speed: 0.52, offset: 2.0 },
    ],
    color3d: 0x8fbc5a, emissive: 0x3a6010,
    size3d: 1.2, orbitRadius: 10, speed3d: 0.005, inc: 0.18, rotY: 0.0,
  },

  {
    id: "kloudtech-swe",
    kind: "work",
    name: "Kloudtech Corp",
    shortName: "Kloudtech",
    title: "Software Engineer",
    sub: "Kloudtech Corporation (US Dept of State–funded startup) · Bataan",
    period: "Jun 2024 – Present",
    tex: "/planets/2k_neptune.jpg",
    shortDesc: [
      "Software Engineer | Jun 2024 – Present",
      "Led team of 4 across 2 major platform versions",
      "KloudTrack IoT v1→v2 on AWS (IoT Core, S3, EC2)",
      "MQTT/TLS · Socket.IO · React 19 · TanStack · Mapbox GL",
      "90%+ LRU cache hit rate · <100ms MQTT latency",
      "25+ weather stations · multi-tenant SaaS · CI/CD",
    ],
    homeDesc: "Led team of 4 engineers building production-grade IoT weather & fleet platform for DRRM government offices.",
    homeBullets: [
      "Led and mentored a team of 4 developers through two major platform versions, progressing from initial VPS deployment to production-grade AWS infrastructure with Docker and GitHub Actions CI/CD, achieving 8+ months of continuous operation serving DRRM offices in the Philippines.",
      "Architected and rebuilt KloudTrack IoT platform from Version 1 to Version 2 (enterprise-grade), implementing distributed architecture integrating ESP32 firmware, MQTT over TLS, Socket.IO real-time communication, and AWS services (IoT Core, S3, EC2, IAM).",
      "Built high-performance backend systems including custom LRU cache achieving 90%+ hit rate, MQTT telemetry pipeline with <100ms latency, and WebSocket infrastructure supporting 100+ concurrent users with real-time presence tracking.",
      "Implemented production-grade security with X.509 PKI certificate-based device authentication, JWT with refresh tokens, multi-tier rate limiting, and AWS S3-based OTA firmware update system with checksum validation.",
      "Developed React 19 frontend using TanStack stack, Tailwind CSS 4, and Mapbox GL for interactive weather visualization with 24-hour timeline animation, supporting multi-tenant SaaS for 25+ weather stations across 4 station types.",
    ],
    github: undefined,
    technologies: ["TypeScript", "React", "MQTT", "AWS", "Docker", "Socket.IO", "TanStack", "Tailwind", "Mapbox GL"],
    worldX: 6500, worldY: 70,
    color: "#4a90e2", radius: 90,
    satellites: [
      { label: "TypeScript", color: "#3b82f6", orbitR: 120, speed: 0.42, offset: 0.0  },
      { label: "React 19",   color: "#61dafb", orbitR: 134, speed: 0.34, offset: 1.2  },
      { label: "MQTT",       color: "#f97316", orbitR: 148, speed: 0.27, offset: 2.4  },
      { label: "AWS",        color: "#ff9900", orbitR: 162, speed: 0.21, offset: 0.8  },
      { label: "Docker",     color: "#2496ed", orbitR: 127, speed: 0.38, offset: 3.6  },
      { label: "Socket.IO",  color: "#25c2a0", orbitR: 141, speed: 0.29, offset: 1.6  },
      { label: "TanStack",   color: "#f59e0b", orbitR: 155, speed: 0.23, offset: 4.8  },
      { label: "Tailwind",   color: "#06b6d4", orbitR: 113, speed: 0.48, offset: 2.0  },
      { label: "Mapbox GL",  color: "#4264fb", orbitR: 176, speed: 0.18, offset: 5.5  },
    ],
    color3d: 0x4a90e2, emissive: 0x183060,
    size3d: 2.0, orbitRadius: 24, speed3d: 0.002, inc: 0.12, rotY: 1.8,
  },

  {
    id: "revearth",
    kind: "work",
    name: "RevEarth",
    title: "Full-Stack Developer (Freelance)",
    sub: "RevEarth GHG Emissions · Balanga City, Bataan",
    period: "Aug 2025 – Dec 2025",
    tex: "/planets/2k_mars.jpg",
    shortDesc: [
      "Carbon footprint tracking app for Philippine orgs",
      "Next.js 15 · React 19 · PostgreSQL · Prisma ORM",
      "EPA / IPCC AR5 emission factor calculations",
      "Automated PDF & Excel reporting with Recharts",
    ],
    homeDesc: "Carbon footprint tracking application for Philippine organizations with scientifically-backed GHG calculations.",
    homeBullets: [
      "Developed comprehensive carbon footprint tracking application for Philippine organizations using Next.js 15, React 19, TypeScript, PostgreSQL, and Prisma ORM with 21 API endpoints and 13 database models.",
      "Built scientifically-backed calculation engine using EPA, IPCC AR5, and Philippine DOE 2024 emission factors for Scope 1, 2, and 3 emissions tracking.",
      "Created automated PDF/Excel reporting system with Recharts visualizations for emissions breakdown by scope, category, and time period.",
    ],
    github: undefined,
    technologies: ["Next.js", "React", "PostgreSQL", "TypeScript", "Prisma ORM", "Better-Auth", "AWS Amplify"],
    worldX: 9800, worldY: -55,
    color: "#22c55e", radius: 70,
    satellites: [
      { label: "Next.js 15",   color: "#eeeeee", orbitR: 105, speed: 0.48, offset: 0.0  },
      { label: "React 19",     color: "#61dafb", orbitR: 116, speed: 0.40, offset: 1.3  },
      { label: "PostgreSQL",   color: "#4169e1", orbitR: 128, speed: 0.32, offset: 2.6  },
      { label: "TypeScript",   color: "#3b82f6", orbitR: 110, speed: 0.44, offset: 0.7  },
      { label: "Prisma ORM",   color: "#7c3aed", orbitR: 122, speed: 0.36, offset: 3.8  },
      { label: "Better-Auth",  color: "#ec4899", orbitR: 134, speed: 0.28, offset: 5.1  },
      { label: "AWS Amplify",  color: "#ff9900", orbitR: 100, speed: 0.55, offset: 1.0  },
    ],
    color3d: 0x4ae27a, emissive: 0x1a7030,
    size3d: 1.6, orbitRadius: 16, speed3d: 0.003, inc: 0.22, rotY: 0.9,
  },

  {
    id: "concentrix",
    kind: "work",
    name: "Concentrix",
    title: "Software Developer",
    sub: "Concentrix · Quezon City, Metro Manila",
    period: "Aug 2025 – Present",
    tex: "/planets/2k_venus_surface.jpg",
    shortDesc: [
      "Software Developer | Aug 2025 – Present",
      "Zendesk integration for Polyglot translation platform",
      "OAuth 2.0 · Azure AD B2C · WebSocket · SignalR",
      "TypeScript DDD migration · 18-state Shopee FSM",
      "AWS Lambda for MediGuide insurance policy API",
      "Python CLI: 10K+ tickets migrated, 80% time saved",
    ],
    homeDesc: "Full-stack developer building enterprise integrations, SaaS platforms, and serverless healthcare APIs for an international team.",
    homeBullets: [
      "Collaborated with Romania-based international development team to architect and develop Zendesk integration connector for Polyglot translation platform, implementing OAuth 2.0/Azure AD B2C authentication, per-agent OAuth and real-time WebSocket/SignalR protocol translation enabling 100+ customer support agents to access translation capabilities across 20+ languages.",
      "Developed TypeScript migration of legacy JavaScript e-commerce platform with Domain-Driven Design and Prisma ORM, creating 800+ item migration checklist and implementing 18-state Shopee return/refund state machine for presales demonstration and internal product development.",
      "Contributed to MediGuide healthcare platform by developing serverless AWS Lambda function for insurance policy verification, integrating with external insurer APIs using OAuth2 authentication, implementing AWS Parameter Store for encrypted credential management, and scalable multi-insurer architecture with GDPR compliance.",
      "Engineered Python CLI migration tool for PDIC client, migrating 10,000+ historical tickets from Excel to Zendesk with zero data loss and 80% time reduction compared to manual migration.",
    ],
    github: undefined,
    technologies: ["TypeScript", "OAuth 2.0", "Azure AD", "Python", "AWS Lambda", "SignalR", "Prisma ORM"],
    worldX: 13200, worldY: 70,
    color: "#e2a84a", radius: 78,
    satellites: [
      { label: "TypeScript",  color: "#3b82f6", orbitR: 112, speed: 0.46, offset: 0.0  },
      { label: "OAuth 2.0",   color: "#ef4444", orbitR: 124, speed: 0.38, offset: 1.1  },
      { label: "Azure AD",    color: "#0078d4", orbitR: 136, speed: 0.30, offset: 2.3  },
      { label: "Python",      color: "#ffd43b", orbitR: 118, speed: 0.42, offset: 3.5  },
      { label: "AWS Lambda",  color: "#ff9900", orbitR: 130, speed: 0.35, offset: 0.5  },
      { label: "SignalR",     color: "#84cc16", orbitR: 142, speed: 0.26, offset: 4.7  },
      { label: "Prisma ORM",  color: "#7c3aed", orbitR: 108, speed: 0.52, offset: 1.9  },
    ],
    color3d: 0xe2a84a, emissive: 0x704010,
    size3d: 2.4, orbitRadius: 33, speed3d: 0.0015, inc: 0.28, rotY: 0.5,
  },

  // ── Education ──────────────────────────────────────────────────────────────

  {
    id: "bpsu",
    kind: "education",
    name: "Bataan Peninsula State University",
    shortName: "BPSU",
    title: "BS Computer Science — Cum Laude",
    sub: "Bataan Peninsula State University",
    period: "2020 – Sep 2024 · GPA 3.63",
    tex: "/planets/2k_uranus.jpg",
    ringTex: "/planets/2k_saturn_ring_alpha.png",
    hasRing: true,
    shortDesc: [
      "BS Computer Science · Major in Software Development",
      "Graduated Cum Laude · GPA 3.63 · Dean's List 2020–2024",
      "Thesis: CultureConnect — social media with collaborative filtering",
      "Coursework: Software Engineering, DSA, AI, OS, App Dev",
    ],
    homeDesc: "Bachelor of Science in Computer Science, graduated Cum Laude with GPA 3.63, specializing in software engineering and system design.",
    homeBullets: [
      "Graduated Cum Laude with latin honor, specializing in software engineering, algorithms, and system design. Developed strong foundation in programming languages, database management, and software development methodologies.",
    ],
    github: undefined,
    technologies: ["Software Eng", "Algorithms", "AI / ML", "Networking", "OS & Systems"],
    worldX: 19000, worldY: 45,
    color: "#facc15", radius: 100,
    satellites: [
      { label: "Software Eng",   color: "#60a5fa", orbitR: 138, speed: 0.30, offset: 0.0, size: 3.5 },
      { label: "Algorithms",     color: "#f97316", orbitR: 152, speed: 0.25, offset: 1.5, size: 3.5 },
      { label: "AI / ML",        color: "#a78bfa", orbitR: 166, speed: 0.20, offset: 3.0, size: 3.5 },
      { label: "Networking",     color: "#34d399", orbitR: 130, speed: 0.36, offset: 4.5, size: 3.5 },
      { label: "OS & Systems",   color: "#fb923c", orbitR: 180, speed: 0.16, offset: 0.8, size: 3.5 },
    ],
    color3d: 0xf5c842, emissive: 0x7a5800,
    size3d: 1.9, orbitRadius: 44, speed3d: 0.0011, inc: 0.48, rotY: 1.2,
  },

  // ── Projects ───────────────────────────────────────────────────────────────

  {
    id: "cultureconnect",
    kind: "project",
    showOnHome: false,   // thesis project — galaxy only
    name: "CultureConnect",
    title: "Thesis — Social Media Platform",
    period: "2024",
    tex: "/planets/2k_makemake_fictional.jpg",
    shortDesc: [
      "Social media platform with collaborative filtering",
      "Led team of developers for thesis project",
      "TypeScript · React · PostgreSQL · Express · Node.js",
    ],
    homeDesc: "Led team developing social media platform with collaborative filtering algorithms for content recommendation.",
    homeBullets: [
      "Led team developing social media platform with collaborative filtering algorithms for content recommendation.",
      "TypeScript · React · PostgreSQL · Express · Node.js",
    ],
    github: "https://github.com/rekasa7000/cultureconnect",
    technologies: ["TypeScript", "React", "PostgreSQL", "Express", "Node.js"],
    worldX: 23500, worldY: -70,
    color: "#a78bfa", radius: 60,
    satellites: [
      { label: "TypeScript", color: "#3b82f6", orbitR: 90,  speed: 0.52, offset: 0.0,  size: 3 },
      { label: "React",      color: "#61dafb", orbitR: 102, speed: 0.44, offset: 1.2,  size: 3 },
      { label: "PostgreSQL", color: "#4169e1", orbitR: 96,  speed: 0.48, offset: 2.4,  size: 3 },
      { label: "Express",    color: "#aaaaaa", orbitR: 110, speed: 0.38, offset: 3.6,  size: 3 },
      { label: "Node.js",    color: "#68a063", orbitR: 118, speed: 0.33, offset: 5.0,  size: 3 },
    ],
    color3d: 0xa78bfa, emissive: 0x3a1080,
    size3d: 1.1, orbitRadius: 60, speed3d: 0.00085, inc: 0.42, rotY: 0.3,
  },

  {
    id: "kloudtrack",
    kind: "project",
    name: "KloudTrack",
    title: "IoT Fleet / Weather Platform",
    period: "2024",
    tex: "/planets/2k_neptune.jpg",
    homeTitle: "KloudTrack Weather System",
    shortDesc: [
      "Real-time weather & fleet data from IoT stations",
      "Web dashboard for DRRM government offices",
      "React · TypeScript · Node.js · PostgreSQL · AWS",
    ],
    homeDesc: "A comprehensive weather monitoring system with real-time data collection from hardware stations and web dashboard for government officials and citizens.",
    homeBullets: [
      "A comprehensive weather monitoring system with real-time data collection from hardware stations and web dashboard for government officials and citizens.",
      "React · TypeScript · Node.js · PostgreSQL · AWS",
    ],
    github: "https://github.com/rekasa7000/kloudtrack",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    worldX: 27000, worldY: 80,
    color: "#60a5fa", radius: 52,
    satellites: [
      { label: "React",     color: "#61dafb", orbitR: 82,  speed: 0.52, offset: 0.0, size: 3 },
      { label: "Node.js",   color: "#68a063", orbitR: 96,  speed: 0.44, offset: 2.0, size: 3 },
      { label: "AWS",       color: "#ff9900", orbitR: 88,  speed: 0.48, offset: 4.0, size: 3 },
    ],
    color3d: 0x4fc3f7, emissive: 0x0d4a70,
    size3d: 1.0, orbitRadius: 67, speed3d: 0.00078, inc: 0.32, rotY: 0.6,
  },

  {
    id: "logcha",
    kind: "project",
    name: "Logcha",
    title: "Time Tracker for Interns",
    period: "2024",
    tex: "/planets/2k_haumea_fictional.jpg",
    shortDesc: [
      "Simple and modern time tracking for interns & OJTs",
      "React · TypeScript · TanStack · Go · Fiber",
    ],
    homeDesc: "A simple and modern time tracking app for interns and OJTs, built with Go and React.",
    homeBullets: [
      "Simple and modern time tracking app for interns & OJTs.",
      "React · TypeScript · TanStack · Go · Fiber",
    ],
    github: "https://github.com/rekasa7000/logcha",
    technologies: ["Go", "React", "TypeScript", "TanStack", "Fiber"],
    worldX: 30500, worldY: -60,
    color: "#34d399", radius: 45,
    satellites: [
      { label: "Go",     color: "#00acd7", orbitR: 75,  speed: 0.56, offset: 0.0, size: 3 },
      { label: "React",  color: "#61dafb", orbitR: 88,  speed: 0.46, offset: 2.1, size: 3 },
    ],
    color3d: 0x80cbc4, emissive: 0x1a5a55,
    size3d: 0.85, orbitRadius: 73, speed3d: 0.00072, inc: 0.58, rotY: 2.2,
  },

  {
    id: "hananai",
    kind: "project",
    name: "HananAI",
    title: "AI Breakfast Companion",
    period: "2024",
    tex: "/planets/2k_mars.jpg",
    shortDesc: [
      "AI agent inspired by Hanan, Tagalog goddess of morning",
      "Conversational breakfast companion",
      "Python · Google Gemini",
    ],
    homeDesc: "AI agent inspired by Hanan, the Tagalog goddess of morning, for your breakfast.",
    homeBullets: [
      "AI agent inspired by Hanan, the Tagalog goddess of morning.",
      "Python · Google Gemini",
    ],
    github: "https://github.com/rekasa7000/hananai",
    technologies: ["Python", "AI/ML", "Google Gemini"],
    worldX: 33500, worldY: 75,
    color: "#fb923c", radius: 45,
    satellites: [
      { label: "Python", color: "#ffd43b", orbitR: 75,  speed: 0.56, offset: 0.0, size: 3 },
      { label: "Gemini", color: "#4285f4", orbitR: 88,  speed: 0.46, offset: 2.1, size: 3 },
    ],
    color3d: 0xf48fb1, emissive: 0x6a1040,
    size3d: 0.85, orbitRadius: 79, speed3d: 0.00065, inc: 0.7, rotY: 3.0,
  },

  {
    id: "databox",
    kind: "project",
    name: "Databox",
    title: "Desktop Time Management App",
    period: "2022",
    tex: "/planets/2k_eris_fictional.jpg",
    shortDesc: [
      "Led team creating desktop time management app",
      "Scheduler, progress tracker, background notifications",
      "C# · .NET · MySQL",
    ],
    homeDesc: "A student scheduler and progress tracker that runs in the background for real-time notification and alerts. Developed using C#, .NET, MySQL, and Apache Server.",
    homeBullets: [
      "Led team creating desktop time management application with scheduler, progress tracker, and background notifications.",
      "C# · .NET · MySQL · Apache",
    ],
    github: "https://github.com/rekasa7000/databox",
    technologies: ["C#", ".NET", "MySQL", "Apache"],
    worldX: 37000, worldY: -60,
    color: "#c084fc", radius: 50,
    satellites: [
      { label: "C#",    color: "#9b4993", orbitR: 78,  speed: 0.54, offset: 0.0, size: 3 },
      { label: ".NET",  color: "#512bd4", orbitR: 92,  speed: 0.46, offset: 1.6, size: 3 },
      { label: "MySQL", color: "#4479a1", orbitR: 84,  speed: 0.50, offset: 3.2, size: 3 },
    ],
    color3d: 0xce93d8, emissive: 0x4a0070,
    size3d: 0.8, orbitRadius: 85, speed3d: 0.0006, inc: 0.36, rotY: 2.5,
  },

  {
    id: "knowt",
    kind: "project",
    name: "Knowt",
    title: "Article Summarization App",
    period: "2023",
    tex: "/planets/2k_ceres_fictional.jpg",
    shortDesc: [
      "Led team building article summarization web app",
      "ML models and sentiment analysis",
      "Python · Flask · Firebase",
    ],
    homeDesc: "Advanced article summarization tool with AI-powered sentiment analysis, built using Python Flask and Firebase for secure content processing and management.",
    homeBullets: [
      "Led team building article summarization web application with ML models and sentiment analysis.",
      "Python · Flask · Firebase · HTML/CSS",
    ],
    github: "https://github.com/rekasa7000/knowt",
    technologies: ["Python", "Flask", "Firebase", "HTML/CSS"],
    worldX: 40500, worldY: 65,
    color: "#86efac", radius: 50,
    satellites: [
      { label: "Python",   color: "#ffd43b", orbitR: 78,  speed: 0.55, offset: 0.0, size: 3 },
      { label: "Flask",    color: "#aaaaaa", orbitR: 92,  speed: 0.46, offset: 1.5, size: 3 },
      { label: "Firebase", color: "#ffca28", orbitR: 84,  speed: 0.50, offset: 3.0, size: 3 },
    ],
    color3d: 0xa5d6a7, emissive: 0x1a5a20,
    size3d: 0.8, orbitRadius: 90, speed3d: 0.00055, inc: 0.5, rotY: 1.6,
  },

  {
    id: "jobowl",
    kind: "project",
    name: "Jobowl",
    title: "Desktop Job Application Tracker",
    period: "2024",
    tex: "/planets/2k_venus_surface.jpg",
    shortDesc: [
      "Desktop job tracker with intuitive GNOME GUI",
      "Track applications, manage statuses & search",
      "Rust · GTK4",
    ],
    homeDesc: "Desktop job application tracker with intuitive GUI for tracking applications, managing statuses, and monitoring job search progress. Built for GNOME desktop.",
    homeBullets: [
      "Desktop job application tracker with intuitive GNOME GUI for tracking applications, managing statuses, and monitoring progress.",
      "Rust · GTK4 · Desktop",
    ],
    github: "https://github.com/rekasa7000/jobowl",
    technologies: ["Rust", "GTK4", "Desktop"],
    worldX: 44000, worldY: -65,
    color: "#fca5a5", radius: 45,
    satellites: [
      { label: "Rust",  color: "#f97316", orbitR: 75, speed: 0.54, offset: 0.0, size: 3 },
      { label: "GTK4",  color: "#4a9a4a", orbitR: 88, speed: 0.44, offset: 2.2, size: 3 },
    ],
    color3d: 0xef9a9a, emissive: 0x6a1010,
    size3d: 0.75, orbitRadius: 95, speed3d: 0.0005, inc: 0.44, rotY: 1.4,
  },
];

// ── Convenience slices ────────────────────────────────────────────────────────

export const WORK_ENTRIES    = ENTRIES.filter(e => e.kind === "work");
export const EDU_ENTRIES     = ENTRIES.filter(e => e.kind === "education");
export const PROJECT_ENTRIES = ENTRIES.filter(e => e.kind === "project");

// ── Skills list (shared by 2-D asteroid belt + 3-D belt) ─────────────────────

export const SKILLS = [
  "TypeScript", "JavaScript", "Python", "Go", "C#", "Rust", "PHP", "Java",
  "React", "Next.js", "Vue.js", "Tailwind CSS", "Angular", "Svelte",
  "Node.js", "NestJS", "FastAPI", "Flask", "Gin", "Express",
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma", "Firebase", "Supabase",
  "AWS", "Docker", "GitHub Actions", "Vercel", "Figma", "Git",
];

// ── Homepage helpers ──────────────────────────────────────────────────────────

/** Projects list for the homepage "Selected Works" section */
export const homeProjects = PROJECT_ENTRIES
  .filter(e => e.showOnHome !== false)
  .map(e => ({
    title: e.homeTitle ?? e.name,
    description: e.homeDesc,
    githubUrl: e.github ?? "",
    technologies: e.technologies,
    year: e.period ?? "",
  }));

/** Experience timeline entries for the homepage (reverse-chronological) */
export const homeExperience = [...WORK_ENTRIES].reverse().map(e => ({
  period: e.period ?? "",
  title: e.title,
  organization: e.sub ?? e.name,
  description: e.homeBullets,
}));

/** Education timeline entries for the homepage */
export const homeEducation = [
  {
    period: "2020 – 2024",
    title: "Bachelor of Science in Computer Science",
    organization: "Bataan Peninsula State University",
    description:
      "Graduated Cum Laude with latin honor, specializing in software engineering, algorithms, and system design. Developed strong foundation in programming languages, database management, and software development methodologies.",
  },
  {
    period: "2018 – 2020",
    title: "Science, Technology, Engineering and Mathematics (STEM)",
    organization: "Microcity College of Business and Technology",
    description:
      "Graduated with Honor. Focused on mathematics, science, and technology fundamentals that provided a strong foundation for computer science studies.",
  },
];

/** Skills categories for the homepage Skills section */
export const homeSkills = [
  { category: "Frontend",     items: ["React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "Tailwind CSS"] },
  { category: "Backend",      items: ["Node.js", "Express", "Flask", "FastAPI", "Gin"] },
  { category: "Database",     items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Firebase"] },
  { category: "Languages",    items: ["Javascript", "Typescript", "Go", "Python", "PHP", "C#", "Rust", "C/C++", "Java"] },
  { category: "Tools",        items: ["Git", "GitHub", "Postman", "VS Code", "Unity"] },
  { category: "Cloud & DevOps", items: ["AWS", "Vercel", "Heroku", "Docker", "Hostinger VPS", "DigitalOcean"] },
  { category: "Design",       items: ["Figma", "Canva"] },
];

/** Skill icon definitions for the homepage tech grid */
export const SKILL_ICONS: Array<{ id: string; label: string; category: string }> = [
  { id: "nextjs",     label: "Next.js",    category: "frontend"  },
  { id: "react",      label: "React",      category: "frontend"  },
  { id: "vue",        label: "Vue.js",     category: "frontend"  },
  { id: "nuxtjs",     label: "Nuxt.js",    category: "frontend"  },
  { id: "angular",    label: "Angular",    category: "frontend"  },
  { id: "svelte",     label: "Svelte",     category: "frontend"  },
  { id: "tailwind",   label: "Tailwind",   category: "frontend"  },
  { id: "ts",         label: "TypeScript", category: "language"  },
  { id: "js",         label: "JavaScript", category: "language"  },
  { id: "python",     label: "Python",     category: "language"  },
  { id: "go",         label: "Go",         category: "language"  },
  { id: "php",        label: "PHP",        category: "language"  },
  { id: "rust",       label: "Rust",       category: "language"  },
  { id: "cs",         label: "C#",         category: "language"  },
  { id: "cpp",        label: "C++",        category: "language"  },
  { id: "java",       label: "Java",       category: "language"  },
  { id: "nodejs",     label: "Node.js",    category: "backend"   },
  { id: "express",    label: "Express",    category: "backend"   },
  { id: "flask",      label: "Flask",      category: "backend"   },
  { id: "fastapi",    label: "FastAPI",    category: "backend"   },
  { id: "postgresql", label: "PostgreSQL", category: "database"  },
  { id: "mongodb",    label: "MongoDB",    category: "database"  },
  { id: "mysql",      label: "MySQL",      category: "database"  },
  { id: "firebase",   label: "Firebase",   category: "database"  },
  { id: "supabase",   label: "Supabase",   category: "database"  },
  { id: "aws",        label: "AWS",        category: "cloud"     },
  { id: "vercel",     label: "Vercel",     category: "cloud"     },
  { id: "heroku",     label: "Heroku",     category: "cloud"     },
  { id: "docker",     label: "Docker",     category: "cloud"     },
  { id: "git",        label: "Git",        category: "tool"      },
  { id: "github",     label: "GitHub",     category: "tool"      },
  { id: "postman",    label: "Postman",    category: "tool"      },
  { id: "vscode",     label: "VS Code",    category: "tool"      },
  { id: "figma",      label: "Figma",      category: "tool"      },
  { id: "unity",      label: "Unity",      category: "tool"      },
];

export const TICKER_TEXT =
  "Full-Stack Developer · Software Engineer · Cloud Architecture · IoT Systems · AWS · TypeScript · React · Go · Open Source · Cum Laude";
