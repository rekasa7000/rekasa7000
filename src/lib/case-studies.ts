/**
 * Case studies. Every claim here is taken from the role descriptions in career-data.ts;
 * nothing is estimated or invented.
 */

export type CaseStudy = {
  slug: string;
  /** must match the project title shown on the homepage card */
  project: string;
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
];

export const caseStudyFor = (projectTitle: string) => CASE_STUDIES.find((c) => c.project === projectTitle);
