/**
 * Case studies. Every claim here is taken from the owner's résumé (see career-data.ts);
 * nothing is estimated or invented. Client names the résumé leaves out are left out here.
 */

export type CaseStudy = {
  slug: string;
  /** the project card on the homepage that links here, if any (must match its title) */
  project?: string;
  /** the job card on the homepage that links here (a career entry id) */
  job: string;
  /** which 3D scene opens the page */
  scene: "rain" | "languages" | "carbon" | "water" | "music";
  /** false = hide from the homepage "Selected Works" grid; still reachable via its job card */
  showOnHome?: boolean;
  /** short period shown on the homepage work card, e.g. "2024–Present" */
  year: string;
  /** pre-made cover image for the homepage work card, e.g. "/images/works/kloudtrack.webp" */
  coverImage?: string;
  title: string;
  tagline: string;
  /** entries marked `detail` are left off the page while SIMPLE_TIMELINE is on */
  facts: { label: string; value: string; detail?: boolean }[];
  need: string[];
  flow: { step: string; title: string; detail: string }[];
  results: { value: string; label: string; note: string; detail?: boolean; onlyPublic?: boolean }[];
  role: { title: string; text: string }[];
  stack: string[];
  github?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "kloudtrack",
    project: "KloudTrack Weather System",
    job: "kloudtech-swe",
    scene: "rain",
    year: "2024–Present",
    coverImage: "/images/works/kloudtrack.png",
    title: "KloudTrack",
    tagline: "A live weather network for disaster-response offices in the Philippines.",
    facts: [
      { label: "Role", value: "Owner of the platform" },
      { label: "Capacity", value: "Co-founder; part-time technical consultant since Sep 2026", detail: true },
      { label: "Team", value: "4 developers mentored" },
      { label: "When", value: "Jun 2024 – present", detail: true },
      { label: "Where", value: "Kloudtech Corporation, Bataan" },
    ],
    need: [
      "Disaster risk reduction (DRRM) offices need to know what the weather is doing right now, where they are.",
      "KloudTrack puts weather stations in the field and streams their readings to a dashboard those offices can watch live.",
    ],
    flow: [
      { step: "01", title: "Stations", detail: "ESP32 firmware on 25+ stations across 4 station types." },
      {
        step: "02",
        title: "Secure link",
        detail: "MQTT over TLS. Each device proves itself with an X.509 certificate.",
      },
      {
        step: "03",
        title: "Cloud",
        detail: "AWS IoT Core, EC2, S3 and IAM. Firmware updates ship over the air from S3 with checksum validation.",
      },
      {
        step: "04",
        title: "Backend",
        detail:
          "A telemetry pipeline with a custom message queue, a custom LRU cache, Socket.IO for live updates, JWT with refresh tokens and multi-tier rate limiting.",
      },
      {
        step: "05",
        title: "Dashboard",
        detail:
          "React 19, TanStack, Radix UI and Mapbox GL: a live map with a 24-hour timeline animation, multi-tenant for each office.",
      },
    ],
    results: [
      { value: "25+", label: "Weather stations", note: "Across 4 station types" },
      { value: "99.9%", label: "Uptime", note: "8+ months, zero-downtime deploys" },
      { value: "<100ms", label: "Telemetry latency", note: "MQTT telemetry pipeline" },
      { value: "90%+", label: "Cache hit rate", note: "Custom LRU cache" },
      { value: "100+", label: "Concurrent users", note: "With real-time presence" },
      { value: "70%", label: "Fewer runtime errors", note: "After fixing V1's issues" },
    ],
    role: [
      {
        title: "Owned it end to end",
        text: "Architecture, device firmware integration, backend, frontend, cloud infrastructure, deployment and ongoing upgrades, while mentoring 4 developers.",
      },
      {
        title: "Rebuilt the platform",
        text: "Re-architected version 1 into an enterprise-grade version 2, from a Coolify-managed VPS to production AWS with Docker and GitHub Actions CI/CD.",
      },
      {
        title: "Made it safe",
        text: "Fixed CORS misconfiguration, SQL injection risk and N+1 queries, then added certificate-based device authentication, token refresh, rate limiting and verified over-the-air updates.",
      },
    ],
    stack: [
      "TypeScript",
      "React 19",
      "TanStack",
      "Tailwind CSS 4",
      "Radix UI",
      "Mapbox GL",
      "Node.js",
      "Socket.IO",
      "MQTT",
      "ESP32",
      "AWS IoT Core",
      "EC2",
      "S3",
      "Docker",
      "Coolify",
      "GitHub Actions",
    ],
    github: "https://github.com/rekasa7000/kloudtrack",
  },
  {
    slug: "zendesk-translation",
    job: "concentrix",
    scene: "languages",
    showOnHome: false,
    year: "2025–Present",
    coverImage: "/images/works/zendesk-translation.webp",
    project: "Translation for Zendesk",
    title: "Translation for Zendesk",
    tagline: "Live translation inside the help desk, so support agents can answer in languages they don't speak.",
    facts: [
      { label: "Role", value: "Architect of the connector" },
      { label: "Team", value: "With an internal Romania-based team" },
      { label: "When", value: "Aug 2025 – present" },
      { label: "Where", value: "Concentrix, Quezon City" },
    ],
    need: [
      "Support agents work in Zendesk. The translation platform lived somewhere else.",
      "The connector brings translation into the tool agents already use, as a product that can be rolled out again and again.",
    ],
    flow: [
      { step: "01", title: "Agent", detail: "A support agent opens a ticket in Zendesk." },
      { step: "02", title: "Sign-in", detail: "OAuth 2.0 with Azure AD B2C." },
      {
        step: "03",
        title: "Connector",
        detail: "A productized Zendesk connector sits between the help desk and the translation platform.",
      },
      { step: "04", title: "Live link", detail: "Real-time translation carried over WebSocket and SignalR." },
      { step: "05", title: "Translation", detail: "Translation reaches the agent across 20+ languages." },
    ],
    results: [
      { value: "100+", label: "Support agents", note: "With access to translation" },
      { value: "20+", label: "Languages", note: "Available in the help desk" },
      { value: "10+", label: "Zendesk apps", note: "Also shipped for enterprise clients" },
    ],
    role: [
      {
        title: "Architected it",
        text: "Architected a productized Zendesk connector for the translation platform with an internal Romania-based team.",
      },
      { title: "Built the sign-in", text: "OAuth 2.0 with Azure AD B2C." },
      { title: "Kept it real-time", text: "Real-time WebSocket and SignalR translation for 100+ agents." },
    ],
    stack: ["TypeScript", "Zendesk", "OAuth 2.0", "Azure AD B2C", "WebSocket", "SignalR"],
  },
  {
    slug: "water-footprint",
    job: "up-ice",
    scene: "water",
    year: "2026–Present",
    coverImage: "/images/works/water-footprint.png",
    project: "Water Footprint DSS",
    title: "Water Footprint DSS",
    tagline:
      "A geospatial decision support system that turns a research team's spreadsheet method into a validated engine.",
    facts: [
      { label: "Role", value: "Full Stack Developer" },
      { label: "Capacity", value: "Project-based", detail: true },
      { label: "With", value: "UP Diliman, Institute of Civil Engineering" },
      { label: "When", value: "Feb 2026 – present", detail: true },
      { label: "Where", value: "Quezon City, Metro Manila" },
    ],
    need: [
      "A research team had a water-footprint methodology that lived in Excel.",
      "Planners needed it as a tool: computed per subbasin and barangay, comparable across scenarios, and able to recommend what to do.",
    ],
    flow: [
      {
        step: "01",
        title: "Geography",
        detail: "41 subbasins and 25 barangays, handled as two geographies with PostGIS area-weighted apportionment.",
      },
      {
        step: "02",
        title: "Engine",
        detail: "The team's Excel methodology, rebuilt as a validated compute engine within ±2% of the original.",
      },
      {
        step: "03",
        title: "Runs",
        detail: "Every run is versioned and immutable, so scenarios can be compared side by side.",
      },
      {
        step: "04",
        title: "Advice",
        detail: "An MCDA recommendation engine ranks interventions against water-quality hotspots.",
      },
      { step: "05", title: "Reports", detail: "Automated PDF reports with map and chart exports." },
    ],
    results: [
      { value: "41", label: "Subbasins", note: "Assessed for water footprint" },
      { value: "25", label: "Barangays", note: "Covered by the same engine" },
      { value: "±2%", label: "Accuracy", note: "Against the team's Excel method" },
    ],
    role: [
      {
        title: "Architected the system",
        text: "Next.js 14, FastAPI and PostGIS, with a generated OpenAPI TypeScript client for end-to-end type safety and role-based access for admins, researchers and LGU planners.",
      },
      {
        title: "Made it trustworthy",
        text: "A pytest suite covers the compute engine, authorization and MCDA ranking logic; CI uses path-filtered GitHub Actions and a fresh Neon database branch per pull request.",
      },
      {
        title: "Built the public site",
        text: "Designed and built the public UP-ICE Wiser Cities website, with project and research profiles and interactive data displays.",
      },
    ],
    stack: [
      "Next.js 14",
      "FastAPI",
      "PostGIS",
      "TypeScript",
      "Python",
      "GeoPandas",
      "Neon",
      "pytest",
      "GitHub Actions",
    ],
  },
  {
    slug: "akosi-music",
    job: "akosi",
    scene: "music",
    year: "2026–Present",
    coverImage: "/images/works/akosi-music.png",
    project: "Akosi.Music",
    title: "Akosi.Music",
    tagline: "Physical NFC music cards that unlock an artist's music for the card's registered owner.",
    facts: [
      { label: "Role", value: "Software Engineer & Architect" },
      { label: "Capacity", value: "Part-time", detail: true },
      { label: "Stage", value: "Architecture" },
      { label: "When", value: "Oct 2026 – present", detail: true },
      { label: "Launch", value: "Planned for June 2027", detail: true },
      { label: "Hardware", value: "NTAG 424 DNA chips" },
      { label: "Platforms", value: "iOS and Android" },
    ],
    need: [
      "A card you can hold that plays an artist's catalog or a single release.",
      "It has to work only for the person who owns the card, on any phone, without installing an app.",
    ],
    flow: [
      {
        step: "01",
        title: "Card",
        detail: "An NTAG 424 DNA chip inside a physical card: one type for an artist, one for a single release.",
      },
      { step: "02", title: "Tap", detail: "Secure Dynamic Messaging secures the link the card hands over." },
      {
        step: "03",
        title: "Any phone",
        detail: "A single NFC link works on both iOS and Android, with no native app.",
      },
      { step: "04", title: "Owner check", detail: "Playback is bound to the card's registered owner." },
      { step: "05", title: "Stream", detail: "Access-controlled streaming through signed URLs on S3 and CloudFront." },
    ],
    results: [
      { value: "2", label: "Card types", note: "Artist and release" },
      { value: "0", label: "Native apps", note: "One link for iOS and Android" },
      { value: "Jun '27", label: "Planned launch", note: "From concept through launch", detail: true },
      { value: "1", label: "NFC link", note: "Bound to the card's owner", onlyPublic: true },
    ],
    role: [
      {
        title: "Designed the ownership model",
        text: "Ownership-bound playback using NTAG 424 DNA chips with Secure Dynamic Messaging.",
      },
      {
        title: "Fixed the streaming",
        text: "Replaced public video hosting with access-controlled streaming via signed URLs.",
      },
      {
        title: "Delivered the plan",
        text: "The stack, data model, system diagrams, client pitch deck, page inventory and a phased timeline.",
      },
    ],
    stack: ["Next.js", "Node.js", "Fastify", "PostgreSQL", "Prisma", "NTAG 424 DNA", "AWS S3", "CloudFront"],
  },
  {
    slug: "revearth",
    job: "revearth",
    scene: "carbon",
    year: "2025",
    coverImage: "/images/works/revearth.png",
    project: "RevEarth",
    title: "RevEarth",
    tagline: "A carbon-footprint tracker for Philippine organizations, built on published emission science.",
    facts: [
      { label: "Role", value: "Full-stack Developer" },
      { label: "Capacity", value: "Project-based", detail: true },
      { label: "Client", value: "RevEarth GHG Emissions Tracking" },
      { label: "When", value: "Aug – Dec 2025", detail: true },
      { label: "Where", value: "Balanga City, Bataan" },
    ],
    need: [
      "Organizations that want to cut emissions first have to count them, across everything they burn, buy and use.",
      "RevEarth turns that activity into Scope 1, 2 and 3 emissions using recognised emission factors, then reports on it.",
    ],
    flow: [
      { step: "01", title: "Activity in", detail: "An organization records what it used, across its operations." },
      { step: "02", title: "Factors", detail: "EPA, IPCC AR5 and Philippine DOE 2024 emission factors are applied." },
      { step: "03", title: "Engine", detail: "The calculation engine works out Scope 1, 2 and 3 emissions." },
      { step: "04", title: "Charts", detail: "Recharts breakdowns by scope, category and period." },
      { step: "05", title: "Reports", detail: "Automated PDF and Excel reports come out the other end." },
    ],
    results: [
      { value: "21", label: "API endpoints", note: "Built for the platform" },
      { value: "13", label: "Data models", note: "Prisma on Supabase PostgreSQL" },
      { value: "3", label: "Emission scopes", note: "Scope 1, 2 and 3 tracked" },
    ],
    role: [
      {
        title: "Built and deployed it",
        text: "Next.js 15, React 19, TypeScript, Prisma and Supabase PostgreSQL, hosted on Vercel.",
      },
      {
        title: "Got the science right",
        text: "An emissions calculation engine on EPA, IPCC AR5 and Philippine DOE 2024 emission factors.",
      },
      {
        title: "Secured it",
        text: "Better-Auth with OAuth 2.0 and email verification, rate limiting and security headers.",
      },
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Prisma",
      "Supabase PostgreSQL",
      "Better-Auth",
      "Recharts",
      "Vercel",
    ],
  },
];

import { SIMPLE_TIMELINE } from "./career-data";

/** the facts and results a visitor sees */
export const visibleFacts = (c: CaseStudy) => c.facts.filter((f) => !(SIMPLE_TIMELINE && f.detail));
export const visibleResults = (c: CaseStudy) => c.results.filter((r) => (SIMPLE_TIMELINE ? !r.detail : !r.onlyPublic));

export const caseStudyFor = (projectTitle: string) => CASE_STUDIES.find((c) => c.project === projectTitle);

export const caseStudyForJob = (jobId: string) => CASE_STUDIES.find((c) => c.job === jobId);
