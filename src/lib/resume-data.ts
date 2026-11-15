import { CERTIFICATIONS, ENTRIES } from "./career-data";

/**
 * The résumé, mirroring the owner's own document. Bullets come from career-data so the
 * two never drift; this file only decides grouping, order and which bullets appear.
 */

const bullets = (id: string, count?: number) => {
  const entry = ENTRIES.find((e) => e.id === id);
  if (!entry) throw new Error(`Unknown career entry: ${id}`);
  return count ? entry.homeBullets.slice(0, count) : entry.homeBullets;
};

export const RESUME = {
  name: "Regee Casaña",
  location: "Bataan, Philippines",
  email: "regeecasana57@gmail.com",
  links: [
    { label: "linkedin.com/in/rekasa", href: "https://linkedin.com/in/rekasa" },
    { label: "github.com/rekasa7000", href: "https://github.com/rekasa7000" },
  ],
  summary:
    "Software engineer and technical lead who designs, architects, and builds production systems, from enterprise Zendesk integrations and cloud services to IoT platforms. Currently lead an eight-person engineering team while staying hands-on, taking products from concept through deployment. Adaptable across stacks and domains, with experience in customer experience, healthcare, government, and disaster risk reduction, and focused on delivering reliable, secure, and maintainable software.",
  work: [
    {
      org: "Concentrix",
      place: "Quezon City, Metro Manila",
      roles: [
        { title: "Technical Lead, Software Engineering", period: "July 2026 – Present" },
        { title: "Software Developer", period: "August 2025 – July 2026" },
      ],
      // the résumé lists the first seven; the site's full story keeps one more
      bullets: bullets("concentrix", 7),
    },
    {
      org: "Kloudtech Corporation",
      place: "Balanga City, Bataan",
      roles: [
        {
          title: "Co-Founder, Software Engineering & Architecture Technical Consultant (Part-time)",
          period: "September 2026 – Present",
        },
        { title: "Software Engineer", period: "June 2024 – August 2026" },
        { title: "Software Engineering Intern", period: "October 2023 – June 2024" },
      ],
      bullets: bullets("kloudtech-swe"),
    },
  ],
  freelance: [
    {
      org: "University of the Philippines – Diliman, Institute of Civil Engineering",
      place: "Quezon City, Metro Manila",
      roles: [{ title: "Full Stack Developer (Project-Based)", period: "February 2026 – Present" }],
      bullets: bullets("up-ice"),
    },
    {
      org: "Akosi.Music (NFC Music Cards Platform)",
      place: "",
      roles: [{ title: "Software Engineer & Architect (Part-time)", period: "October 2026 – Present" }],
      bullets: bullets("akosi"),
    },
    {
      org: "RevEarth (GHG Emissions Tracking)",
      place: "Balanga City, Bataan",
      roles: [{ title: "Full-Stack Developer (Project-Based)", period: "August 2025 – December 2025" }],
      bullets: bullets("revearth"),
    },
  ],
  education: {
    school: "Bataan Peninsula State University – Main Campus",
    place: "Balanga City, Bataan",
    degree: "B.S. Computer Science, Major in Software Development (Cum Laude, GPA 3.63)",
    date: "September 2024",
  },
  skills: [
    { category: "Languages", items: "JavaScript/TypeScript, Java, C#, C/C++, Python, PHP, SQL" },
    { category: "Frameworks", items: "React, Vue, Nuxt, Next.js, Node.js, Express, .NET, Flask, Fiber" },
    { category: "Databases", items: "PostgreSQL, Supabase, MySQL, MongoDB, Prisma ORM" },
    { category: "Backend/Data", items: "FastAPI, GeoPandas, Shapely, Rasterio, pyproj, Alembic, PostGIS" },
    { category: "Frontend", items: "MapLibre GL JS, Apache ECharts, shadcn/ui" },
    {
      category: "Infrastructure",
      items:
        "AWS (S3, IoT Core, EC2, Lambda, DynamoDB, API Gateway, Parameter Store, IAM), Neon, Railway, Cloudflare R2, Bun/Turborepo, Docker, Coolify, GitHub Actions, Vercel, Firebase, MQTT, WebSocket, Serverless Framework",
    },
    {
      category: "Other",
      items: "Zendesk, NiCE Cognigy, OAuth 2.0, Azure AD B2C, Domain-Driven Design, Figma, Mermaid.js",
    },
  ],
  certifications: [
    "NiCE Cognigy: Cognigy Specialist (2026)",
    "Microsoft: Associate Office Specialist – PowerPoint, Word, Excel (2024)",
    "Cisco: Cyber Threat Management (2024)",
    "Pearson: IT Specialist – Network Security (2024), Cybersecurity (2023)",
  ],
  certificationCount: CERTIFICATIONS.length,
};

export type ResumeBlock = (typeof RESUME.work)[number];
