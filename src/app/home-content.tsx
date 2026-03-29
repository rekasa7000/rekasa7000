"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { CursorSpotlight } from "@/components/cursor-spotlight";
import { TerminalHero } from "@/components/terminal-hero";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/motion-wrappers";
import { AnimatedTimeline, type TimelineEntry } from "@/components/animated-timeline";
import { StatsBar } from "@/components/counter";

const projects = [
  {
    title: "KloudTrack Weather System",
    description:
      "A comprehensive weather monitoring system with real-time data collection from hardware stations and web dashboard for government officials and citizens.",
    githubUrl: "https://github.com/rekasa7000/kloudtrack",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    year: "2024",
  },
  {
    title: "Logcha",
    description: "A simple and modern time tracking app for interns and OJTs, built with Go and React.",
    githubUrl: "https://github.com/rekasa7000/logcha",
    technologies: ["React", "Typescript", "Tanstack", "Golang", "Fiber"],
    year: "2024",
  },
  {
    title: "Jobowl",
    description:
      "Desktop job application tracker with intuitive GUI for tracking applications, managing statuses, and monitoring job search progress. Built for GNOME desktop.",
    githubUrl: "https://github.com/rekasa7000/jobowl",
    technologies: ["Rust", "GTK4", "Desktop"],
    year: "2024",
  },
  {
    title: "Databox",
    description:
      "A student scheduler and progress tracker that runs in the background for real-time notification and alerts. Developed using C#, .NET, MySQL, and Apache Server",
    githubUrl: "https://github.com/rekasa7000/databox",
    technologies: ["C#", ".NET", "MySQL", "Apache"],
    year: "2023",
  },
  {
    title: "HananAI",
    description: "AI agent inspired by Hanan, the Tagalog goddess of morning, for your breakfast.",
    githubUrl: "https://github.com/rekasa7000/hananai",
    technologies: ["Python", "AI/ML", "Google Gemini"],
    year: "2024",
  },
  {
    title: "Knowt",
    description:
      "Advanced article summarization tool with AI-powered sentiment analysis, built using Python Flask and Firebase for secure content processing and management.",
    githubUrl: "https://github.com/rekasa7000/knowt",
    technologies: ["Python", "Flask", "Firebase", "HTML/CSS"],
    year: "2023",
  },
];

const experienceEntries: TimelineEntry[] = [
  {
    period: "June 2024 - Present",
    title: "Software Engineer",
    organization: "Kloudtech Corp",
    description:
      "Lead Software Engineer leading a team of three developers. Architected and developed a comprehensive weather monitoring system with real-time data collection, IoT integration, and web dashboard for clients.",
  },
  {
    period: "August 2025 - Present",
    title: "Software Developer",
    organization: "Concentrix Catalyst",
    description:
      "Design and deliver secure, scalable backend integrations across enterprise CX platforms. Spearheaded TypeScript system modernization, implemented OAuth2/Azure AD B2C authentication with encrypted token lifecycle management, built serverless AWS healthcare verification services, and developed high-volume data migration tooling—cutting manual workload by 80% while ensuring zero data loss.",
  },
  {
    period: "August 2025 - December 2025",
    title: "Full Stack Developer",
    organization: "RevEarth",
    description:
      "Designed and delivered a production-ready GHG emissions tracking SaaS for Philippine organizations. Architected multi-tenant backend (21 APIs, 13 data models), implemented OAuth2-based authentication and secure session management, and developed standards-aligned emissions calculation engine (EPA, IPCC AR5, DOE). Enabled automated regulatory-ready reporting and analytics dashboards for Scope 1–3 emissions.",
  },
  {
    period: "October 2023 - May 2024",
    title: "Software Engineering Intern",
    organization: "Kloudtech Corp",
    description:
      "Learned about IoT, applied cybersecurity, enhanced and maintained company's web app, and optimized the codebase.",
  },
];

const educationEntries: TimelineEntry[] = [
  {
    period: "2020 - 2024",
    title: "Bachelor of Science in Computer Science",
    organization: "Bataan Peninsula State University",
    description:
      "Graduated Cum Laude with latin honor, specializing in software engineering, algorithms, and system design. Developed strong foundation in programming languages, database management, and software development methodologies.",
  },
  {
    period: "2018 - 2020",
    title: "Science, Technology, Engineering and Mathematics (STEM)",
    organization: "Microcity College of Business and Technology",
    description:
      "Graduated with Honor. Focused on mathematics, science, and technology fundamentals that provided a strong foundation for computer science studies.",
  },
];

const skills = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "Flask", "FastAPI", "Gin"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Firebase"],
  },
  {
    category: "Languages",
    items: ["Javascript", "Typescript", "Go", "Python", "PHP", "C#", "Rust", "C/C++", "Java"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Postman", "VS Code", "Unity"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS", "Vercel", "Heroku", "Docker", "Hostinger VPS", "DigitalOcean"],
  },
  { category: "Design", items: ["Figma", "Canva"] },
];

const skillIcons = [
  "nextjs",
  "react",
  "vue",
  "nuxtjs",
  "angular",
  "svelte",
  "ts",
  "js",
  "python",
  "go",
  "php",
  "rust",
  "nodejs",
  "express",
  "flask",
  "fastapi",
  "postgresql",
  "mongodb",
  "mysql",
  "firebase",
  "supabase",
  "cs",
  "cpp",
  "java",
  "aws",
  "vercel",
  "heroku",
  "docker",
  "tailwind",
  "unity",
  "git",
  "github",
  "postman",
  "vscode",
  "figma",
];

export function HomeContent() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const allTechs = [...new Set(projects.flatMap((p) => p.technologies))];
  const filteredProjects = activeFilter
    ? projects.filter((p) => p.technologies.includes(activeFilter))
    : projects;

  return (
    <div
      className="min-h-screen font-mono relative transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      {/* Subtle Japanese pattern background */}
      <div className="fixed inset-0 jp-pattern-dots pointer-events-none z-0" />
      <CursorSpotlight />

      <DarkModeToggle />
      <ScrollIndicator />

      <header
        className="z-50 w-full hidden md:block relative backdrop-blur-sm"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="w-full px-6 py-6">
          <div className="flex items-center justify-center gap-4 text-sm font-bold w-full jp-street-text">
            <div className="w-[720px] text-center">Full-stack Developer</div>
            <div className="h-[0.07rem] w-full bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-500" />
            <div className="w-[720px] text-center neon-accent">Software Engineer</div>
            <div className="h-[0.07rem] w-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400" />
            <div className="w-[720px] text-center">Technical Architect</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="max-w-6xl mx-auto px-6 relative z-10 backdrop-blur-sm"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* Hero Section */}
        <section className="py-20 md:pt-20 md:pb-40 border-b" style={{ borderColor: "var(--border-color)" }}>
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-10">
              <TerminalHero />
            </div>

            <h2 className="text-2xl md:text-5xl font-bold mb-8 leading-tight">
              Software Engineer specializing in modern web technologies and scalable applications.
            </h2>
            <div className="text-lg space-y-4" style={{ color: "var(--text-secondary)" }}>
              <p>
                Computer science graduate with latin honor. Currently working as Lead Software Engineer at Kloudtech
                Corp.
              </p>
              <p>
                I build weather monitoring systems, time tracking applications, and AI-powered tools that solve
                real-world problems.
              </p>
            </div>
          </motion.div>

          <StatsBar />

          <motion.div
            className="flex gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/about-me" className="text-sm neon-border px-4 py-2 street-hover jp-street-text">
              About Me <span className="text-xs neon-accent ml-1">私について</span>
            </Link>
            <Link
              href="/about-portfolio"
              className="text-sm border px-4 py-2 street-hover jp-street-text"
              style={{ borderColor: "var(--border-color)" }}
            >
              About Portfolio{" "}
              <span className="text-xs ml-1" style={{ color: "var(--text-secondary)" }}>
                ポートフォリオ
              </span>
            </Link>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section className="py-20 border-b" id="experience" style={{ borderColor: "var(--border-color)" }}>
          <FadeInSection>
            <h2 className="text-2xl font-bold mb-12">Experience</h2>
          </FadeInSection>
          <AnimatedTimeline entries={experienceEntries} />
        </section>

        {/* Education Section */}
        <section className="py-20 border-b" id="education" style={{ borderColor: "var(--border-color)" }}>
          <FadeInSection>
            <h2 className="text-2xl font-bold mb-12">Education</h2>
          </FadeInSection>
          <AnimatedTimeline entries={educationEntries} />
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 border-b" style={{ borderColor: "var(--border-color)" }}>
          <FadeInSection>
            <h2 className="text-2xl font-bold mb-12">Skills & Technologies</h2>
          </FadeInSection>

          {/* Tech Icons Grid */}
          <StaggerContainer className="mb-16 grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6">
            {skillIcons.map((icon) => (
              <StaggerItem key={icon} className="flex justify-center">
                <img
                  src={`https://skillicons.dev/icons?i=${icon}`}
                  alt={icon}
                  className="w-8 h-8 grayscale hover:grayscale-0 transition-all"
                />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Skills Categories */}
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <StaggerItem key={skill.category} className="space-y-3 skill-category">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500">{skill.category}</h3>
                <div className="space-y-1">
                  {skill.items.map((item) => (
                    <div key={item} className="text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Works Section */}
        <section id="works" className="py-20 border-b" style={{ borderColor: "var(--border-color)" }}>
          <FadeInSection>
            <h2 className="text-2xl font-bold mb-8">Selected Works</h2>
          </FadeInSection>

          {/* Tech filter pills */}
          <FadeInSection delay={0.05}>
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => { setActiveFilter(null); setExpandedIndex(null); }}
                className="text-xs px-3 py-1 border transition-colors"
                style={{
                  borderColor: activeFilter === null ? "var(--water-blue)" : "var(--border-color)",
                  color: activeFilter === null ? "var(--water-blue)" : "var(--text-secondary)",
                }}
              >
                All
              </button>
              {allTechs.map((tech) => (
                <button
                  key={tech}
                  onClick={() => { setActiveFilter(activeFilter === tech ? null : tech); setExpandedIndex(null); }}
                  className="text-xs px-3 py-1 border transition-colors"
                  style={{
                    borderColor: activeFilter === tech ? "var(--water-blue)" : "var(--border-color)",
                    color: activeFilter === tech ? "var(--water-blue)" : "var(--text-secondary)",
                  }}
                >
                  {tech}
                </button>
              ))}
            </div>
          </FadeInSection>

          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const idx = projects.indexOf(project);
                const isExpanded = expandedIndex === idx;
                return (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3 }}
                    className="project-card cursor-pointer"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  >
                    <div className="grid md:grid-cols-12 gap-8 items-start relative z-10">
                      <div className="md:col-span-3">
                        <div className="text-sm text-gray-500 mb-2">{project.year}</div>
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                      </div>
                      <div className="md:col-span-6">
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="md:col-span-3 flex justify-end items-start gap-3">
                        <span
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {isExpanded ? "▲ collapse" : "▼ details"}
                        </span>
                      </div>
                    </div>

                    {/* Expandable detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: "hidden" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div
                            className="mt-6 pt-6 border-t flex justify-between items-center"
                            style={{ borderColor: "var(--border-color)" }}
                          >
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                              View the full source code and documentation on GitHub.
                            </p>
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm px-4 py-2 border street-hover"
                              style={{ borderColor: "var(--water-blue)", color: "var(--water-blue)" }}
                            >
                              View on GitHub →
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <FadeInSection>
            <h2 className="text-2xl font-bold mb-12">Contact</h2>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-gray-600">
                  I&apos;m always interested in discussing new opportunities, collaborations, or just having a
                  conversation about technology and software development.
                </p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Email:</span>
                    <a href="mailto:regeecasana57@gmail.com" className="contact-link">
                      regeecasana57@gmail.com
                    </a>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">LinkedIn:</span>
                    <a href="https://linkedin.com/in/rekasa" target="_blank" className="contact-link">
                      linkedin.com/in/rekasa
                    </a>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">GitHub:</span>
                    <a href="https://github.com/rekasa7000" target="_blank" className="contact-link">
                      github.com/rekasa7000
                    </a>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Twitter:</span>
                    <a href="https://x.com/regeewashere" target="_blank" className="contact-link">
                      @regeewashere
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20" style={{ borderColor: "var(--border-color)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-sm text-gray-500">© 2024 Regee Casaña</div>
        </div>
      </footer>
    </div>
  );
}
