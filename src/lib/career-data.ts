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
  shortName?: string; // abbreviated label used in galaxy views

  // ── Textual content ───────────────────────────────────────────────────────
  name: string; // display name (planet label)
  title: string; // role / degree / tagline
  sub?: string; // org + location (2-D info card sub-title)
  period?: string;
  shortDesc: string[]; // 3–6 bullet lines → galaxy info panels
  homeTitle?: string; // title override for homepage projects list
  homeDesc: string; // single prose line → homepage projects list
  homeBullets: string[]; // detailed paragraphs → homepage experience timeline
  showOnHome?: boolean; // false = galaxy only, not shown on homepage
  coverImage?: string; // pre-made cover image for the homepage work card, e.g. "/images/works/databox.webp"
  github?: string;
  technologies: string[];

  // ── Texture ───────────────────────────────────────────────────────────────
  tex: string; // e.g. "/planets/2k_mars.jpg"
  ringTex?: string; // ring-plane texture (BPSU only)

  // ── 2-D canvas visual ─────────────────────────────────────────────────────
  worldX: number;
  worldY: number;
  color: string; // CSS hex "#rrggbb"
  radius: number; // canvas pixels
  hasRing?: boolean;
  satellites: TechSatellite[];

  // ── 3-D Three.js visual ───────────────────────────────────────────────────
  color3d: number; // Three.js hex, e.g. 0x4a90e2
  emissive: number;
  size3d: number;
  orbitRadius: number;
  speed3d: number;
  inc: number;
  rotY: number;
};

// ── Master entry list ─────────────────────────────────────────────────────────

const ALL_ENTRIES: CareerEntry[] = [
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
    worldX: 3500,
    worldY: -80,
    color: "#5a9060",
    radius: 65,
    satellites: [
      { label: "TypeScript", color: "#3b82f6", orbitR: 96, speed: 0.44, offset: 0.0 },
      { label: "React", color: "#61dafb", orbitR: 108, speed: 0.36, offset: 1.5 },
      { label: "AWS", color: "#ff9900", orbitR: 120, speed: 0.28, offset: 3.0 },
      { label: "Docker", color: "#2496ed", orbitR: 82, speed: 0.52, offset: 2.0 },
    ],
    color3d: 0x8fbc5a,
    emissive: 0x3a6010,
    size3d: 1.2,
    orbitRadius: 10,
    speed3d: 0.005,
    inc: 0.18,
    rotY: 0.0,
  },

  {
    id: "kloudtech-swe",
    kind: "work",
    name: "Kloudtech Corp",
    shortName: "Kloudtech",
    title: "Co-Founder & Technical Consultant · Software Engineer",
    sub: "Kloudtech Corporation · Balanga City, Bataan",
    period: "Jun 2024 – Present",
    tex: "/planets/2k_neptune.jpg",
    shortDesc: [
      "Co-Founder & Technical Consultant (part-time) | Sep 2026 – Present",
      "Software Engineer | Jun 2024 – Aug 2026",
      "Own KloudTrack end to end: firmware to cloud to dashboard",
      "V1→V2 on AWS · 99.9% uptime · zero-downtime deploys",
      "90%+ LRU cache hit rate · <100ms MQTT latency",
      "25+ weather stations · runtime errors cut by 70%",
    ],
    homeDesc:
      "Co-founder and owner of KloudTrack, a real-time IoT weather platform for DRRM offices in the Philippines.",
    homeBullets: [
      "Own KloudTrack, the company's flagship real-time IoT weather platform for DRRM offices in the Philippines, end to end: architecture, device firmware integration, backend, frontend, cloud infrastructure, deployment, and ongoing upgrades.",
      "Led the platform through two major versions, from a Coolify-managed VPS to production-grade AWS (EC2, Docker, GitHub Actions CI/CD), mentoring 4 developers and sustaining 8+ months of continuous operation at 99.9% uptime with zero-downtime deployments and automated migrations.",
      "Re-architected V1 into an enterprise-grade V2: ESP32 firmware, MQTT over TLS, Socket.IO, and AWS IoT Core, S3, EC2, and IAM, with X.509 certificate-based device authentication and checksum-validated OTA firmware updates.",
      "Engineered high-performance backend services: a custom LRU cache (90%+ hit rate), an MQTT telemetry pipeline (<100ms latency, custom message queue), and WebSockets for 100+ concurrent users with real-time presence.",
      "Built the React 19 frontend (TanStack Query/Router/Form/Table, Tailwind CSS 4, Radix UI, Mapbox GL) with a 24-hour weather timeline animation for a multi-tenant SaaS spanning 25+ weather stations and 4 station types.",
      "Resolved critical V1 security and performance issues (CORS misconfiguration, SQL injection risk, N+1 queries) and added JWT with refresh tokens and multi-tier rate limiting, cutting runtime errors by 70%.",
    ],
    github: undefined,
    technologies: [
      "TypeScript",
      "React",
      "MQTT",
      "AWS",
      "Docker",
      "Socket.IO",
      "TanStack",
      "Tailwind",
      "Radix UI",
      "Mapbox GL",
      "ESP32",
      "Coolify",
    ],
    worldX: 6500,
    worldY: 70,
    color: "#4a90e2",
    radius: 90,
    satellites: [
      { label: "TypeScript", color: "#3b82f6", orbitR: 120, speed: 0.42, offset: 0.0 },
      { label: "React 19", color: "#61dafb", orbitR: 134, speed: 0.34, offset: 1.2 },
      { label: "MQTT", color: "#f97316", orbitR: 148, speed: 0.27, offset: 2.4 },
      { label: "AWS", color: "#ff9900", orbitR: 162, speed: 0.21, offset: 0.8 },
      { label: "Docker", color: "#2496ed", orbitR: 127, speed: 0.38, offset: 3.6 },
      { label: "Socket.IO", color: "#25c2a0", orbitR: 141, speed: 0.29, offset: 1.6 },
      { label: "TanStack", color: "#f59e0b", orbitR: 155, speed: 0.23, offset: 4.8 },
      { label: "Tailwind", color: "#06b6d4", orbitR: 113, speed: 0.48, offset: 2.0 },
      { label: "Mapbox GL", color: "#4264fb", orbitR: 176, speed: 0.18, offset: 5.5 },
    ],
    color3d: 0x4a90e2,
    emissive: 0x183060,
    size3d: 2.0,
    orbitRadius: 24,
    speed3d: 0.002,
    inc: 0.12,
    rotY: 1.8,
  },

  {
    id: "revearth",
    kind: "work",
    name: "RevEarth",
    title: "Full-Stack Developer (Project-Based)",
    sub: "RevEarth GHG Emissions · Balanga City, Bataan",
    period: "Aug 2025 – Dec 2025",
    tex: "/planets/2k_mars.jpg",
    shortDesc: [
      "Carbon footprint tracking platform for Philippine orgs",
      "Next.js 15 · React 19 · Prisma · Supabase PostgreSQL",
      "Scope 1, 2, 3 engine: EPA / IPCC AR5 / PH DOE 2024",
      "Automated PDF & Excel reports · Better-Auth security",
    ],
    homeDesc:
      "Carbon footprint tracking application for Philippine organizations with scientifically-backed GHG calculations.",
    homeBullets: [
      "Built and deployed a carbon footprint tracking platform for Philippine organizations on Next.js 15, React 19, TypeScript, Prisma, and Supabase PostgreSQL, hosted on Vercel, with 21 API endpoints and 13 data models.",
      "Engineered an emissions calculation engine for Scope 1, 2, and 3 using EPA, IPCC AR5, and Philippine DOE 2024 emission factors, with automated PDF/Excel reports and Recharts breakdowns by scope, category, and period.",
      "Secured the app with Better-Auth (OAuth 2.0, email verification), rate limiting, and security headers.",
    ],
    github: undefined,
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Prisma",
      "Supabase",
      "PostgreSQL",
      "Better-Auth",
      "Recharts",
      "Vercel",
    ],
    worldX: 9800,
    worldY: -55,
    color: "#22c55e",
    radius: 70,
    satellites: [
      { label: "Next.js 15", color: "#eeeeee", orbitR: 105, speed: 0.48, offset: 0.0 },
      { label: "React 19", color: "#61dafb", orbitR: 116, speed: 0.4, offset: 1.3 },
      { label: "PostgreSQL", color: "#4169e1", orbitR: 128, speed: 0.32, offset: 2.6 },
      { label: "TypeScript", color: "#3b82f6", orbitR: 110, speed: 0.44, offset: 0.7 },
      { label: "Prisma ORM", color: "#7c3aed", orbitR: 122, speed: 0.36, offset: 3.8 },
      { label: "Better-Auth", color: "#ec4899", orbitR: 134, speed: 0.28, offset: 5.1 },
      { label: "Supabase", color: "#3ecf8e", orbitR: 100, speed: 0.55, offset: 1.0 },
    ],
    color3d: 0x4ae27a,
    emissive: 0x1a7030,
    size3d: 1.6,
    orbitRadius: 16,
    speed3d: 0.003,
    inc: 0.22,
    rotY: 0.9,
  },

  {
    id: "concentrix",
    kind: "work",
    name: "Concentrix",
    title: "Technical Lead, Software Engineering",
    sub: "Concentrix · Quezon City, Metro Manila",
    period: "Aug 2025 – Present",
    tex: "/planets/2k_venus_surface.jpg",
    shortDesc: [
      "Technical Lead | Jul 2026 – Present",
      "Software Developer | Aug 2025 – Jul 2026",
      "Lead a team of 8 at Concentrix TPS Philippines",
      "ONEix: a connected customer experience platform, architected and built from the ground up",
      "Zendesk translation connector: 100+ agents, 20+ languages",
      "10+ private Zendesk apps shipped for enterprise clients",
    ],
    homeDesc:
      "Technical lead for an eight-person team, and architect of ONEix, where an AI agent answers customers first and a human picks up with the full story.",
    homeBullets: [
      "Lead a team of 8, myself plus 7 software developers, owning architecture decisions, code quality, and technical mentorship for the Concentrix TPS Philippines team.",
      "Architecting and building ONEix, a new multi-tenant customer experience platform for Concentrix TPS Manila (MVP in progress): one agent workspace and a website call widget, where a NICE Cognigy AI agent answers first and hands over to a human agent over WebRTC, with Zendesk as the ticket system.",
      "Architected a productized Zendesk connector for a translation platform with an internal Romania-based team: OAuth 2.0/Azure AD B2C and real-time WebSocket/SignalR translation for 100+ agents across 20+ languages.",
      "Shipped 10+ private Zendesk apps to production for multiple enterprise clients, including document generation (PDF/Word receipts and verification slips), verification workflows, and signature capture.",
      "Built integration-as-a-service for an overseas banking client: a Render-hosted middleware that converts TikTok direct messages into Zendesk tickets via Sunshine Conversations, and an IVR automation that updates the client's IVR throughout the day, including agent skills, languages, and related settings.",
      "Built a serverless AWS Lambda service for a global client's insurance policy verification, integrating multiple insurer APIs via OAuth2 with encrypted credential management (AWS Parameter Store) and GDPR-compliant, multi-insurer architecture.",
      "Built a Python CLI migration tool for a local client, moving 10,000+ historical tickets and custom fields from Excel to Zendesk with zero data loss, cutting migration time by 80%.",
      "Migrated a legacy JavaScript e-commerce platform to TypeScript with Domain-Driven Design and Prisma ORM, including an 800+ item migration checklist and an 18-state return/refund state machine.",
    ],
    github: undefined,
    technologies: [
      "TypeScript",
      "Next.js",
      "NestJS",
      "PostgreSQL",
      "Redis",
      "Zendesk",
      "OAuth 2.0",
      "Azure AD B2C",
      "SignalR",
      "AWS Lambda",
      "Python",
      "Sunshine Conversations",
      "Render",
    ],
    worldX: 13200,
    worldY: 70,
    color: "#e2a84a",
    radius: 78,
    satellites: [
      { label: "TypeScript", color: "#3b82f6", orbitR: 112, speed: 0.46, offset: 0.0 },
      { label: "OAuth 2.0", color: "#ef4444", orbitR: 124, speed: 0.38, offset: 1.1 },
      { label: "NestJS", color: "#e0234e", orbitR: 136, speed: 0.3, offset: 2.3 },
      { label: "Python", color: "#ffd43b", orbitR: 118, speed: 0.42, offset: 3.5 },
      { label: "AWS Lambda", color: "#ff9900", orbitR: 130, speed: 0.35, offset: 0.5 },
      { label: "PostgreSQL", color: "#4f8fcf", orbitR: 142, speed: 0.26, offset: 4.7 },
      { label: "Prisma ORM", color: "#7c3aed", orbitR: 108, speed: 0.52, offset: 1.9 },
    ],
    color3d: 0xe2a84a,
    emissive: 0x704010,
    size3d: 2.4,
    orbitRadius: 33,
    speed3d: 0.0015,
    inc: 0.28,
    rotY: 0.5,
  },

  {
    id: "up-ice",
    kind: "work",
    name: "UP Diliman ICE",
    shortName: "UP ICE",
    title: "Full Stack Developer (Project-Based)",
    sub: "University of the Philippines – Diliman, Institute of Civil Engineering · Quezon City, Metro Manila",
    period: "Feb 2026 – Present",
    tex: "/planets/2k_uranus.jpg",
    shortDesc: [
      "Full Stack Developer (project-based) | Feb 2026 – Present",
      "Geospatial Decision Support System for water footprint",
      "41 subbasins · 25 barangays · ±2% accuracy",
      "Next.js 14 · FastAPI · PostGIS · Neon",
      "MCDA engine ranking interventions for water quality",
    ],
    homeDesc:
      "A geospatial decision support system that computes water footprint assessments for a university research team.",
    homeBullets: [
      "Architected a geospatial Decision Support System (Next.js 14, FastAPI, PostGIS) computing Water Footprint Assessments for 41 subbasins and 25 barangays, translating a research team's Excel methodology into a validated engine (±2% accuracy).",
      "Designed a dual-geography compute pipeline with PostGIS area-weighted apportionment, versioned/immutable runs for scenario comparison, and an MCDA recommendation engine ranking interventions against water-quality hotspots.",
      "Implemented role-based auth (admin/researcher/LGU-planner), a generated OpenAPI TypeScript client for end-to-end type safety, and automated PDF/report generation with map and chart exports.",
      "Set up CI/CD with path-filtered GitHub Actions, per-PR ephemeral database branching (Neon), and a pytest suite covering the compute engine, authorization, and MCDA ranking logic.",
      "Designed and built the public UP-ICE Wiser Cities website, including project/research profiles and interactive data displays.",
    ],
    github: undefined,
    technologies: [
      "Next.js",
      "FastAPI",
      "PostGIS",
      "TypeScript",
      "Python",
      "GeoPandas",
      "Neon",
      "MapLibre GL",
      "GitHub Actions",
    ],
    worldX: 15400,
    worldY: -60,
    color: "#38bdf8",
    radius: 62,
    satellites: [
      { label: "Next.js 14", color: "#eeeeee", orbitR: 92, speed: 0.46, offset: 0.0 },
      { label: "FastAPI", color: "#10b981", orbitR: 104, speed: 0.38, offset: 1.4 },
      { label: "PostGIS", color: "#4169e1", orbitR: 116, speed: 0.3, offset: 2.8 },
      { label: "GeoPandas", color: "#a78bfa", orbitR: 98, speed: 0.42, offset: 4.0 },
      { label: "Neon", color: "#34d399", orbitR: 110, speed: 0.34, offset: 5.2 },
    ],
    color3d: 0x38bdf8,
    emissive: 0x0c4a6e,
    size3d: 1.5,
    orbitRadius: 38,
    speed3d: 0.0013,
    inc: 0.2,
    rotY: 2.4,
  },

  {
    id: "akosi",
    kind: "work",
    name: "Akosi.Music",
    shortName: "Akosi",
    title: "Software Engineer & Architect (Part-time)",
    sub: "Akosi.Music · NFC Music Cards Platform",
    period: "Oct 2026 – Present",
    tex: "/planets/2k_eris_fictional.jpg",
    shortDesc: [
      "Software Engineer & Architect (part-time) | Oct 2026 – Present",
      "Physical NFC cards that unlock an artist's music",
      "NTAG 424 DNA · Secure Dynamic Messaging",
      "Signed-URL streaming on S3 / CloudFront",
      "Planned launch: June 2027",
    ],
    homeDesc:
      "A web platform for physical NFC music cards that unlock an artist's catalog for the card's registered owner.",
    homeBullets: [
      "Architecting a web platform for physical NFC music cards that unlock an artist's catalog or a single release exclusively for the card's registered owner, from concept through a planned June 2027 launch.",
      "Designed ownership-bound playback using NTAG 424 DNA chips with Secure Dynamic Messaging, so a single NFC link works on both iOS and Android without a native app.",
      "Replaced public video hosting with access-controlled streaming via signed URLs (S3/CloudFront), and defined the stack (Next.js, Node/Fastify, PostgreSQL/Prisma), data model, and two card types (artist vs. release).",
      "Delivered the full architecture package: system diagrams, client pitch deck, page inventory, and a phased timeline.",
    ],
    github: undefined,
    technologies: [
      "Next.js",
      "Node.js",
      "Fastify",
      "PostgreSQL",
      "Prisma",
      "NFC (NTAG 424 DNA)",
      "AWS S3",
      "CloudFront",
    ],
    worldX: 17200,
    worldY: 65,
    color: "#f472b6",
    radius: 55,
    satellites: [
      { label: "Next.js", color: "#eeeeee", orbitR: 84, speed: 0.48, offset: 0.0 },
      { label: "Fastify", color: "#f59e0b", orbitR: 96, speed: 0.4, offset: 1.6 },
      { label: "PostgreSQL", color: "#4169e1", orbitR: 108, speed: 0.32, offset: 3.1 },
      { label: "NFC", color: "#f472b6", orbitR: 90, speed: 0.44, offset: 4.4 },
      { label: "CloudFront", color: "#ff9900", orbitR: 102, speed: 0.36, offset: 5.6 },
    ],
    color3d: 0xf472b6,
    emissive: 0x701a48,
    size3d: 1.3,
    orbitRadius: 41,
    speed3d: 0.0012,
    inc: 0.34,
    rotY: 3.4,
  },

  // ── Education ──────────────────────────────────────────────────────────────

  {
    id: "bpsu",
    kind: "education",
    name: "Bataan Peninsula State University – Main Campus",
    shortName: "BPSU",
    title: "BS Computer Science — Cum Laude",
    sub: "Bataan Peninsula State University – Main Campus · Balanga City, Bataan",
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
    homeDesc:
      "Bachelor of Science in Computer Science, graduated Cum Laude with GPA 3.63, specializing in software engineering and system design.",
    homeBullets: [
      "Graduated Cum Laude with latin honor, specializing in software engineering, algorithms, and system design. Developed strong foundation in programming languages, database management, and software development methodologies.",
    ],
    github: undefined,
    technologies: ["Software Eng", "Algorithms", "AI / ML", "Networking", "OS & Systems"],
    worldX: 19000,
    worldY: 45,
    color: "#facc15",
    radius: 100,
    satellites: [
      { label: "Software Eng", color: "#60a5fa", orbitR: 138, speed: 0.3, offset: 0.0, size: 3.5 },
      { label: "Algorithms", color: "#f97316", orbitR: 152, speed: 0.25, offset: 1.5, size: 3.5 },
      { label: "AI / ML", color: "#a78bfa", orbitR: 166, speed: 0.2, offset: 3.0, size: 3.5 },
      { label: "Networking", color: "#34d399", orbitR: 130, speed: 0.36, offset: 4.5, size: 3.5 },
      { label: "OS & Systems", color: "#fb923c", orbitR: 180, speed: 0.16, offset: 0.8, size: 3.5 },
    ],
    color3d: 0xf5c842,
    emissive: 0x7a5800,
    size3d: 1.9,
    orbitRadius: 44,
    speed3d: 0.0011,
    inc: 0.48,
    rotY: 1.2,
  },

  // ── Projects ───────────────────────────────────────────────────────────────

  {
    id: "cultureconnect",
    kind: "project",
    showOnHome: false, // thesis project — galaxy only
    name: "CultureConnect",
    title: "Thesis — Social Media Platform",
    period: "2024",
    tex: "/planets/2k_makemake_fictional.jpg",
    shortDesc: [
      "Social media platform with collaborative filtering",
      "Led team of developers for thesis project",
      "TypeScript · React · PostgreSQL · Express · Node.js",
    ],
    homeDesc:
      "Led team developing social media platform with collaborative filtering algorithms for content recommendation.",
    homeBullets: [
      "Led team developing social media platform with collaborative filtering algorithms for content recommendation.",
      "TypeScript · React · PostgreSQL · Express · Node.js",
    ],
    github: "https://github.com/rekasa7000/cultureconnect",
    technologies: ["TypeScript", "React", "PostgreSQL", "Express", "Node.js"],
    worldX: 23500,
    worldY: -70,
    color: "#a78bfa",
    radius: 60,
    satellites: [
      { label: "TypeScript", color: "#3b82f6", orbitR: 90, speed: 0.52, offset: 0.0, size: 3 },
      { label: "React", color: "#61dafb", orbitR: 102, speed: 0.44, offset: 1.2, size: 3 },
      { label: "PostgreSQL", color: "#4169e1", orbitR: 96, speed: 0.48, offset: 2.4, size: 3 },
      { label: "Express", color: "#aaaaaa", orbitR: 110, speed: 0.38, offset: 3.6, size: 3 },
      { label: "Node.js", color: "#68a063", orbitR: 118, speed: 0.33, offset: 5.0, size: 3 },
    ],
    color3d: 0xa78bfa,
    emissive: 0x3a1080,
    size3d: 1.1,
    orbitRadius: 60,
    speed3d: 0.00085,
    inc: 0.42,
    rotY: 0.3,
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
    homeDesc:
      "A comprehensive weather monitoring system with real-time data collection from hardware stations and web dashboard for government officials and citizens.",
    homeBullets: [
      "A comprehensive weather monitoring system with real-time data collection from hardware stations and web dashboard for government officials and citizens.",
      "React · TypeScript · Node.js · PostgreSQL · AWS",
    ],
    github: "https://github.com/rekasa7000/kloudtrack",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    worldX: 27000,
    worldY: 80,
    color: "#60a5fa",
    radius: 52,
    satellites: [
      { label: "React", color: "#61dafb", orbitR: 82, speed: 0.52, offset: 0.0, size: 3 },
      { label: "Node.js", color: "#68a063", orbitR: 96, speed: 0.44, offset: 2.0, size: 3 },
      { label: "AWS", color: "#ff9900", orbitR: 88, speed: 0.48, offset: 4.0, size: 3 },
    ],
    color3d: 0x4fc3f7,
    emissive: 0x0d4a70,
    size3d: 1.0,
    orbitRadius: 67,
    speed3d: 0.00078,
    inc: 0.32,
    rotY: 0.6,
  },

  {
    id: "logcha",
    kind: "project",
    name: "Logcha",
    title: "Time Tracker for Interns",
    period: "2024",
    tex: "/planets/2k_haumea_fictional.jpg",
    shortDesc: ["Simple and modern time tracking for interns & OJTs", "React · TypeScript · TanStack · Go · Fiber"],
    homeDesc: "A simple and modern time tracking app for interns and OJTs, built with Go and React.",
    homeBullets: [
      "Simple and modern time tracking app for interns & OJTs.",
      "React · TypeScript · TanStack · Go · Fiber",
    ],
    github: "https://github.com/rekasa7000/logcha",
    technologies: ["Go", "React", "TypeScript", "TanStack", "Fiber"],
    worldX: 30500,
    worldY: -60,
    color: "#34d399",
    radius: 45,
    satellites: [
      { label: "Go", color: "#00acd7", orbitR: 75, speed: 0.56, offset: 0.0, size: 3 },
      { label: "React", color: "#61dafb", orbitR: 88, speed: 0.46, offset: 2.1, size: 3 },
    ],
    color3d: 0x80cbc4,
    emissive: 0x1a5a55,
    size3d: 0.85,
    orbitRadius: 73,
    speed3d: 0.00072,
    inc: 0.58,
    rotY: 2.2,
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
    homeBullets: ["AI agent inspired by Hanan, the Tagalog goddess of morning.", "Python · Google Gemini"],
    github: "https://github.com/rekasa7000/hananai",
    technologies: ["Python", "AI/ML", "Google Gemini"],
    worldX: 33500,
    worldY: 75,
    color: "#fb923c",
    radius: 45,
    satellites: [
      { label: "Python", color: "#ffd43b", orbitR: 75, speed: 0.56, offset: 0.0, size: 3 },
      { label: "Gemini", color: "#4285f4", orbitR: 88, speed: 0.46, offset: 2.1, size: 3 },
    ],
    color3d: 0xf48fb1,
    emissive: 0x6a1040,
    size3d: 0.85,
    orbitRadius: 79,
    speed3d: 0.00065,
    inc: 0.7,
    rotY: 3.0,
  },

  {
    id: "databox",
    kind: "project",
    coverImage: "/images/works/databox.png",
    name: "Databox",
    title: "Desktop Time Management App",
    period: "2022",
    tex: "/planets/2k_eris_fictional.jpg",
    shortDesc: [
      "Led team creating desktop time management app",
      "Scheduler, progress tracker, background notifications",
      "C# · .NET · MySQL",
    ],
    homeDesc:
      "A student scheduler and progress tracker that runs in the background for real-time notification and alerts. Developed using C#, .NET, MySQL, and Apache Server.",
    homeBullets: [
      "Led team creating desktop time management application with scheduler, progress tracker, and background notifications.",
      "C# · .NET · MySQL · Apache",
    ],
    github: "https://github.com/rekasa7000/databox",
    technologies: ["C#", ".NET", "MySQL", "Apache"],
    worldX: 37000,
    worldY: -60,
    color: "#c084fc",
    radius: 50,
    satellites: [
      { label: "C#", color: "#9b4993", orbitR: 78, speed: 0.54, offset: 0.0, size: 3 },
      { label: ".NET", color: "#512bd4", orbitR: 92, speed: 0.46, offset: 1.6, size: 3 },
      { label: "MySQL", color: "#4479a1", orbitR: 84, speed: 0.5, offset: 3.2, size: 3 },
    ],
    color3d: 0xce93d8,
    emissive: 0x4a0070,
    size3d: 0.8,
    orbitRadius: 85,
    speed3d: 0.0006,
    inc: 0.36,
    rotY: 2.5,
  },

  {
    id: "knowt",
    kind: "project",
    coverImage: "/images/works/knowt.png",
    name: "Knowt",
    title: "Article Summarization App",
    period: "2023",
    tex: "/planets/2k_ceres_fictional.jpg",
    shortDesc: [
      "Led team building article summarization web app",
      "ML models and sentiment analysis",
      "Python · Flask · Firebase",
    ],
    homeDesc:
      "Advanced article summarization tool with AI-powered sentiment analysis, built using Python Flask and Firebase for secure content processing and management.",
    homeBullets: [
      "Led team building article summarization web application with ML models and sentiment analysis.",
      "Python · Flask · Firebase · HTML/CSS",
    ],
    github: "https://github.com/rekasa7000/knowt",
    technologies: ["Python", "Flask", "Firebase", "HTML/CSS"],
    worldX: 40500,
    worldY: 65,
    color: "#86efac",
    radius: 50,
    satellites: [
      { label: "Python", color: "#ffd43b", orbitR: 78, speed: 0.55, offset: 0.0, size: 3 },
      { label: "Flask", color: "#aaaaaa", orbitR: 92, speed: 0.46, offset: 1.5, size: 3 },
      { label: "Firebase", color: "#ffca28", orbitR: 84, speed: 0.5, offset: 3.0, size: 3 },
    ],
    color3d: 0xa5d6a7,
    emissive: 0x1a5a20,
    size3d: 0.8,
    orbitRadius: 90,
    speed3d: 0.00055,
    inc: 0.5,
    rotY: 1.6,
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
    homeDesc:
      "Desktop job application tracker with intuitive GUI for tracking applications, managing statuses, and monitoring job search progress. Built for GNOME desktop.",
    homeBullets: [
      "Desktop job application tracker with intuitive GNOME GUI for tracking applications, managing statuses, and monitoring progress.",
      "Rust · GTK4 · Desktop",
    ],
    github: "https://github.com/rekasa7000/jobowl",
    technologies: ["Rust", "GTK4", "Desktop"],
    worldX: 44000,
    worldY: -65,
    color: "#fca5a5",
    radius: 45,
    satellites: [
      { label: "Rust", color: "#f97316", orbitR: 75, speed: 0.54, offset: 0.0, size: 3 },
      { label: "GTK4", color: "#4a9a4a", orbitR: 88, speed: 0.44, offset: 2.2, size: 3 },
    ],
    color3d: 0xef9a9a,
    emissive: 0x6a1010,
    size3d: 0.75,
    orbitRadius: 95,
    speed3d: 0.0005,
    inc: 0.44,
    rotY: 1.4,
  },
];

// ── What the public site shows ───────────────────────────────────────────────

/**
 * Display switch. When on, some entries are presented in a simpler form on the public
 * pages (role and work, without the finer timeline details). Nothing is deleted and no
 * date is altered: the full record stays in ALL_ENTRIES above. Set to false to show
 * every entry exactly as written.
 */
export const SIMPLE_TIMELINE = true;

const PUBLIC_VIEW: Record<string, Partial<CareerEntry>> = {
  "kloudtech-swe": {
    title: "Software Engineer",
    period: undefined,
    homeDesc: "Owner of KloudTrack, a real-time IoT weather platform for DRRM offices in the Philippines.",
    shortDesc: [
      "Software Engineer",
      "Own KloudTrack end to end: firmware to cloud to dashboard",
      "V1→V2 on AWS · 99.9% uptime · zero-downtime deploys",
      "90%+ LRU cache hit rate · <100ms MQTT latency",
      "25+ weather stations · runtime errors cut by 70%",
    ],
  },
  "up-ice": {
    title: "Full Stack Developer",
    period: undefined,
    shortDesc: [
      "Full Stack Developer",
      "Geospatial Decision Support System for water footprint",
      "41 subbasins · 25 barangays · ±2% accuracy",
      "Next.js 14 · FastAPI · PostGIS · Neon",
      "MCDA engine ranking interventions for water quality",
    ],
  },
  akosi: {
    title: "Software Engineer & Architect",
    period: undefined,
    shortDesc: [
      "Software Engineer & Architect",
      "Physical NFC cards that unlock an artist's music",
      "NTAG 424 DNA · Secure Dynamic Messaging",
      "Signed-URL streaming on S3 / CloudFront",
    ],
  },
  revearth: {
    title: "Full-Stack Developer",
    period: undefined,
  },
};

/** bullet wording that is shortened in the simple view */
const PUBLIC_BULLET_EDITS: [string, string][] = [
  [", from concept through a planned June 2027 launch.", ", from concept to launch plan."],
];

const publicBullet = (b: string) => PUBLIC_BULLET_EDITS.reduce((text, [from, to]) => text.replace(from, to), b);

export const ENTRIES: CareerEntry[] = SIMPLE_TIMELINE
  ? ALL_ENTRIES.map((e) =>
      PUBLIC_VIEW[e.id] ? { ...e, ...PUBLIC_VIEW[e.id], homeBullets: e.homeBullets.map(publicBullet) } : e,
    )
  : ALL_ENTRIES;

// ── Convenience slices ────────────────────────────────────────────────────────

export const WORK_ENTRIES = ENTRIES.filter((e) => e.kind === "work");
export const EDU_ENTRIES = ENTRIES.filter((e) => e.kind === "education");
export const PROJECT_ENTRIES = ENTRIES.filter((e) => e.kind === "project");

// ── Skills list (shared by 2-D asteroid belt + 3-D belt) ─────────────────────

export const SKILLS = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "C#",
  "Rust",
  "PHP",
  "Java",
  "C/C++",
  "SQL",
  "React",
  "Next.js",
  "Vue",
  "Nuxt",
  "Tailwind CSS",
  "Angular",
  "Svelte",
  "shadcn/ui",
  "Node.js",
  "Express",
  "FastAPI",
  "Flask",
  "Fiber",
  ".NET",
  "Fastify",
  "PostgreSQL",
  "PostGIS",
  "MongoDB",
  "MySQL",
  "Redis",
  "Prisma",
  "Firebase",
  "Supabase",
  "AWS",
  "Docker",
  "GitHub Actions",
  "Vercel",
  "Coolify",
  "MQTT",
  "Zendesk",
  "Figma",
  "Git",
];

// ── Homepage helpers ──────────────────────────────────────────────────────────

/** School/personal projects shown alongside the real case studies in "Selected Works", tagged as academic work */
const ACADEMIC_SHOWCASE_IDS = ["databox", "knowt", "cultureconnect"];

export const academicProjects = ACADEMIC_SHOWCASE_IDS.map(
  (id) => PROJECT_ENTRIES.find((e) => e.id === id)!
).map((e) => ({
  slug: e.id,
  title: e.homeTitle ?? e.name,
  description: e.homeDesc,
  githubUrl: e.github ?? "",
  technologies: e.technologies,
  year: e.period ?? "",
  coverImage: e.coverImage,
}));

/** Experience timeline entries for the homepage (reverse-chronological) */
export const homeExperience = [...WORK_ENTRIES].reverse().map((e) => ({
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
    organization: "Bataan Peninsula State University – Main Campus",
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
  {
    category: "Languages",
    items: ["JavaScript/TypeScript", "Java", "C#", "C/C++", "Python", "PHP", "SQL", "Go", "Rust"],
  },
  {
    category: "Frameworks",
    items: ["React", "Vue", "Nuxt", "Next.js", "Node.js", "Express", ".NET", "Flask", "Fiber", "Angular", "Svelte"],
  },
  { category: "Databases", items: ["PostgreSQL", "Supabase", "MySQL", "MongoDB", "Prisma ORM"] },
  {
    category: "Backend / Data",
    items: ["FastAPI", "GeoPandas", "Shapely", "Rasterio", "pyproj", "Alembic", "PostGIS"],
  },
  { category: "Frontend", items: ["MapLibre GL JS", "Apache ECharts", "shadcn/ui", "Tailwind CSS"] },
  {
    category: "Infrastructure",
    items: [
      "AWS (S3, IoT Core, EC2, Lambda, DynamoDB, API Gateway, Parameter Store, IAM)",
      "Neon",
      "Railway",
      "Cloudflare R2",
      "Bun/Turborepo",
      "Docker",
      "Coolify",
      "GitHub Actions",
      "Vercel",
      "Firebase",
      "MQTT",
      "WebSocket",
      "Serverless Framework",
    ],
  },
  {
    category: "Other",
    items: ["Zendesk", "NiCE Cognigy", "OAuth 2.0", "Azure AD B2C", "Domain-Driven Design", "Figma", "Mermaid.js"],
  },
];

/** Certifications, as listed on the résumé */
export const CERTIFICATIONS = [
  { issuer: "NiCE Cognigy", name: "Cognigy Specialist", year: "2026" },
  { issuer: "Microsoft", name: "Associate Office Specialist – PowerPoint, Word, Excel", year: "2024" },
  { issuer: "Cisco", name: "Cyber Threat Management", year: "2024" },
  { issuer: "Pearson", name: "IT Specialist – Network Security", year: "2024" },
  { issuer: "Pearson", name: "IT Specialist – Cybersecurity", year: "2023" },
];

/** Skill icon definitions for the homepage tech grid */
export const SKILL_ICONS: Array<{ id: string; label: string; category: string }> = [
  { id: "nextjs", label: "Next.js", category: "frontend" },
  { id: "react", label: "React", category: "frontend" },
  { id: "vue", label: "Vue.js", category: "frontend" },
  { id: "nuxtjs", label: "Nuxt.js", category: "frontend" },
  { id: "angular", label: "Angular", category: "frontend" },
  { id: "svelte", label: "Svelte", category: "frontend" },
  { id: "tailwind", label: "Tailwind", category: "frontend" },
  { id: "ts", label: "TypeScript", category: "language" },
  { id: "js", label: "JavaScript", category: "language" },
  { id: "python", label: "Python", category: "language" },
  { id: "go", label: "Go", category: "language" },
  { id: "php", label: "PHP", category: "language" },
  { id: "rust", label: "Rust", category: "language" },
  { id: "cs", label: "C#", category: "language" },
  { id: "cpp", label: "C++", category: "language" },
  { id: "java", label: "Java", category: "language" },
  { id: "nodejs", label: "Node.js", category: "backend" },
  { id: "express", label: "Express", category: "backend" },
  { id: "flask", label: "Flask", category: "backend" },
  { id: "fastapi", label: "FastAPI", category: "backend" },
  { id: "postgresql", label: "PostgreSQL", category: "database" },
  { id: "mongodb", label: "MongoDB", category: "database" },
  { id: "mysql", label: "MySQL", category: "database" },
  { id: "firebase", label: "Firebase", category: "database" },
  { id: "supabase", label: "Supabase", category: "database" },
  { id: "aws", label: "AWS", category: "cloud" },
  { id: "vercel", label: "Vercel", category: "cloud" },
  { id: "heroku", label: "Heroku", category: "cloud" },
  { id: "docker", label: "Docker", category: "cloud" },
  { id: "git", label: "Git", category: "tool" },
  { id: "github", label: "GitHub", category: "tool" },
  { id: "postman", label: "Postman", category: "tool" },
  { id: "vscode", label: "VS Code", category: "tool" },
  { id: "figma", label: "Figma", category: "tool" },
  { id: "unity", label: "Unity", category: "tool" },
  { id: "dotnet", label: ".NET", category: "backend" },
  { id: "prisma", label: "Prisma", category: "database" },
  { id: "cloudflare", label: "Cloudflare", category: "cloud" },
  { id: "githubactions", label: "GitHub Actions", category: "cloud" },
  { id: "bun", label: "Bun", category: "tool" },
];

export const TICKER_TEXT =
  "Technical Lead · Software Engineer · Zendesk Integrations · IoT Platforms · Cloud Architecture · Geospatial Systems · AWS · TypeScript · React · Python · Cum Laude";
