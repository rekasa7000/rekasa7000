/**
 * Case studies. Every claim here is taken from the role descriptions in career-data.ts;
 * nothing is estimated or invented.
 */

export type CaseStudy = {
  slug: string;
  /** the project card on the homepage that links here, if any (must match its title) */
  project?: string;
  /** the job card on the homepage that links here (a career entry id) */
  job: string;
  /** which 3D scene opens the page */
  scene: "rain" | "languages" | "carbon";
  title: string;
  tagline: string;
  facts: { label: string; value: string }[];
  need: string[];
  flow: { step: string; title: string; detail: string }[];
  results: { value: string; label: string; note: string }[];
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
    title: "KloudTrack",
    tagline: "A live weather network for disaster-response offices in the Philippines.",
    facts: [
      { label: "Role", value: "Software Engineer, team lead" },
      { label: "Team", value: "4 engineers" },
      { label: "When", value: "Jun 2024 – present" },
      { label: "Where", value: "Kloudtech Corp, Bataan" },
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
          "A telemetry pipeline, a custom LRU cache, Socket.IO for live updates, JWT with refresh tokens and multi-tier rate limiting.",
      },
      {
        step: "05",
        title: "Dashboard",
        detail:
          "React 19, TanStack and Mapbox GL: a live map with a 24-hour timeline animation, multi-tenant for each office.",
      },
    ],
    results: [
      { value: "25+", label: "Weather stations", note: "Across 4 station types" },
      { value: "<100ms", label: "Telemetry latency", note: "Station to pipeline over MQTT" },
      { value: "90%+", label: "Cache hit rate", note: "Custom LRU cache" },
      { value: "100+", label: "Concurrent users", note: "With real-time presence" },
      { value: "8+ mo", label: "Continuous operation", note: "Serving DRRM offices" },
      { value: "v1 → v2", label: "Platform rebuild", note: "VPS to production AWS" },
    ],
    role: [
      { title: "Led the team", text: "Led and mentored 4 developers through two major platform versions." },
      {
        title: "Rebuilt the platform",
        text: "Architected the move from version 1 to an enterprise-grade version 2, from a single VPS to AWS with Docker and GitHub Actions CI/CD.",
      },
      {
        title: "Made it safe",
        text: "Certificate-based device authentication, token refresh, rate limiting and verified over-the-air firmware updates.",
      },
    ],
    stack: [
      "TypeScript",
      "React 19",
      "TanStack",
      "Tailwind CSS 4",
      "Mapbox GL",
      "Node.js",
      "Socket.IO",
      "MQTT",
      "ESP32",
      "AWS IoT Core",
      "EC2",
      "S3",
      "Docker",
      "GitHub Actions",
    ],
    github: "https://github.com/rekasa7000/kloudtrack",
  },
  {
    slug: "polyglot-zendesk",
    job: "concentrix",
    scene: "languages",
    title: "Polyglot for Zendesk",
    tagline: "Live translation inside the help desk, so support agents can answer in languages they don't speak.",
    facts: [
      { label: "Role", value: "Software Developer" },
      { label: "Team", value: "International, with developers in Romania" },
      { label: "When", value: "Aug 2025 – present" },
      { label: "Where", value: "Concentrix, Quezon City" },
    ],
    need: [
      "Support agents work in Zendesk. The Polyglot translation platform lived somewhere else.",
      "The connector brings translation into the tool agents already use, with each agent signed in as themselves.",
    ],
    flow: [
      { step: "01", title: "Agent", detail: "A support agent opens a ticket in Zendesk." },
      {
        step: "02",
        title: "Sign-in",
        detail: "OAuth 2.0 with Azure AD B2C, and per-agent OAuth so every agent has their own access.",
      },
      {
        step: "03",
        title: "Connector",
        detail: "The Zendesk integration connector sits between the help desk and the translation platform.",
      },
      {
        step: "04",
        title: "Live link",
        detail: "Real-time protocol translation between WebSocket and SignalR keeps both sides talking.",
      },
      { step: "05", title: "Translation", detail: "Polyglot's translation reaches the agent across 20+ languages." },
    ],
    results: [
      { value: "100+", label: "Support agents", note: "With access to translation" },
      { value: "20+", label: "Languages", note: "Available in the help desk" },
      { value: "2", label: "Protocols bridged", note: "WebSocket and SignalR" },
    ],
    role: [
      {
        title: "Architected it together",
        text: "Worked with a Romania-based international development team to architect and develop the connector.",
      },
      {
        title: "Built the sign-in",
        text: "Implemented OAuth 2.0 with Azure AD B2C authentication and per-agent OAuth.",
      },
      {
        title: "Kept it real-time",
        text: "Implemented the WebSocket and SignalR protocol translation that carries messages live.",
      },
    ],
    stack: ["TypeScript", "OAuth 2.0", "Azure AD B2C", "WebSocket", "SignalR", "Zendesk"],
  },
  {
    slug: "revearth",
    job: "revearth",
    scene: "carbon",
    title: "RevEarth",
    tagline: "A carbon-footprint tracker for Philippine organizations, built on published emission science.",
    facts: [
      { label: "Role", value: "Full-stack Developer (freelance)" },
      { label: "Client", value: "RevEarth GHG Emissions" },
      { label: "When", value: "Aug – Dec 2025" },
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
      {
        step: "04",
        title: "Charts",
        detail: "Recharts visualizations break emissions down by scope, category and time period.",
      },
      { step: "05", title: "Reports", detail: "Automated PDF and Excel reports come out the other end." },
    ],
    results: [
      { value: "21", label: "API endpoints", note: "Built for the application" },
      { value: "13", label: "Database models", note: "With Prisma ORM on PostgreSQL" },
      { value: "3", label: "Emission scopes", note: "Scope 1, 2 and 3 tracked" },
    ],
    role: [
      {
        title: "Built it end to end",
        text: "Developed the application with Next.js 15, React 19, TypeScript, PostgreSQL and Prisma ORM.",
      },
      {
        title: "Got the science right",
        text: "Built the calculation engine on EPA, IPCC AR5 and Philippine DOE 2024 emission factors.",
      },
      {
        title: "Made it reportable",
        text: "Created the automated PDF and Excel reporting system with charted breakdowns.",
      },
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Prisma ORM",
      "Better-Auth",
      "AWS Amplify",
      "Recharts",
    ],
  },
];

export const caseStudyFor = (projectTitle: string) => CASE_STUDIES.find((c) => c.project === projectTitle);

export const caseStudyForJob = (jobId: string) => CASE_STUDIES.find((c) => c.job === jobId);
