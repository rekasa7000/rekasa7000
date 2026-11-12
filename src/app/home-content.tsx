"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, Plus } from "lucide-react";
import { Header } from "@/components/header";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/motion-wrappers";
import { AnimatedTimeline } from "@/components/animated-timeline";
import { OrbitDiagram } from "@/components/orbit-diagram";
import {
  homeProjects as projects,
  homeExperience as experienceEntries,
  homeEducation as educationEntries,
  homeSkills as skills,
  SKILL_ICONS,
  TICKER_TEXT,
} from "@/lib/career-data";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/rekasa7000" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rekasa" },
  { label: "Twitter", href: "https://x.com/regeewashere" },
  { label: "Email", href: "mailto:regeecasana57@gmail.com" },
];

function SectionHeading({ index, title, track }: { index: string; title: string; track: string }) {
  return (
    <FadeInSection>
      <div className="mb-14">
        <div className="section-rule mb-5">
          <span className="session-tag">Session {index}</span>
          <span className="rule-line" aria-hidden="true" />
          <span className="meta-label">{track}</span>
        </div>
        <h2 className="font-display text-4xl md:text-6xl">{title}</h2>
      </div>
    </FadeInSection>
  );
}

/** Live Manila clock for the hero readout. Renders a placeholder until mounted to avoid hydration drift. */
function ManilaClock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">{now ?? "--:--:--"}</span>;
}

const READOUT = [
  { label: "Status", value: <span className="signal-text">● Building</span> },
  { label: "Base", value: "Philippines · UTC+8" },
  { label: "Local", value: <ManilaClock /> },
  { label: "Focus", value: "AI × Web × IoT" },
];

function Ticker() {
  const items = TICKER_TEXT.split(" · ");
  const row = (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="meta-label px-5 py-3" style={{ color: "inherit", letterSpacing: "0.18em" }}>
            {item}
          </span>
          <Plus className="w-3 h-3 shrink-0" style={{ color: "var(--accent)" }} />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee relative z-10" role="presentation">
      <span className="sr-only">{TICKER_TEXT}</span>
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
}

export function HomeContent() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const allTechs = [...new Set(projects.flatMap((p) => p.technologies))];
  const filteredProjects = activeFilter ? projects.filter((p) => p.technologies.includes(activeFilter)) : projects;

  return (
    <div
      className="min-h-screen relative transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <Header activePage="home" />
      <ScrollIndicator />

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          {/* Hero Section — conference poster */}
          <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
            <motion.div
              className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="session-tag">Keynote</span>
              <span className="meta-label">Software Engineer — Philippines</span>
              <span className="meta-label hidden sm:inline font-jp normal-case tracking-normal">
                レジー・カサーニャ
              </span>
            </motion.div>

            <div className="grid md:grid-cols-12 gap-10 md:gap-6 items-center">
              <div className="md:col-span-7">
                <motion.h1
                  className="font-display text-[3.4rem] sm:text-7xl md:text-[5.5rem] lg:text-8xl mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                  Regee
                  <br />
                  Casaña<span style={{ color: "var(--accent)" }}>.</span>
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl mb-5 font-medium"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  Software Engineer · Full-stack Developer · Technical Architect
                </motion.p>

                <motion.p
                  className="max-w-lg text-base leading-relaxed mb-10"
                  style={{ color: "var(--text-secondary)" }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  Based in the Philippines, building web products that people actually enjoy using — with an obsession
                  for clean code and good UX.
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center gap-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <Link href="/about-me" className="btn-ink">
                    About Me <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/about-portfolio" className="btn-ghost">
                    About Portfolio
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="md:col-span-5 flex flex-col gap-6"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <OrbitDiagram className="w-full max-w-[340px] mx-auto md:max-w-none" />

                <dl className="readout text-sm">
                  {READOUT.map((row) => (
                    <div key={row.label} className="readout-row flex items-baseline justify-between gap-4 px-4 py-2.5">
                      <dt className="meta-label">{row.label}</dt>
                      <dd className="font-mono text-[13px] text-right">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </div>

            <motion.div
              className="flex flex-wrap gap-x-6 gap-y-3 mt-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="meta-label" style={{ color: "var(--accent)" }}>
                Frequencies →
              </span>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="link-underline meta-label"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </section>
        </div>

        <Ticker />

        <div className="max-w-5xl mx-auto px-6">
          {/* Experience Section */}
          <section className="py-24" id="experience" style={{ borderColor: "var(--border-color)" }}>
            <SectionHeading index="01" title="Experience" track="Track A — Mission log" />
            <AnimatedTimeline entries={experienceEntries} />
          </section>

          {/* Education Section */}
          <section className="py-24 border-t" id="education" style={{ borderColor: "var(--border-color)" }}>
            <SectionHeading index="02" title="Education" track="Track B — Training" />
            <AnimatedTimeline entries={educationEntries} />
          </section>

          {/* Intermission — generated illustration */}
          <FadeInSection>
            <figure className="pb-24">
              <div className="print-frame">
                <Image
                  src="/images/orbit-banner.webp"
                  alt="Retro-futurist screen print of a striped orange sun, a ringed planet and a small AI satellite tracing orbit lines"
                  width={1664}
                  height={842}
                  sizes="(min-width: 1024px) 976px, 100vw"
                  className="w-full h-auto block"
                />
              </div>
              <figcaption className="flex justify-between gap-4 mt-5">
                <span className="session-tag">Intermission</span>
                <span className="meta-label text-right">Plate I — The long orbit</span>
              </figcaption>
            </figure>
          </FadeInSection>

          {/* Skills Section */}
          <section id="skills" className="py-24 border-t" style={{ borderColor: "var(--border-color)" }}>
            <SectionHeading index="03" title="Skills & Tools" track="Track C — Instruments" />

            {/* Tech icon chips */}
            <FadeInSection>
              <div className="mb-16 flex flex-wrap gap-2.5">
                {SKILL_ICONS.map((s) => (
                  <span key={s.id} className="skill-chip">
                    <img src={`https://skillicons.dev/icons?i=${s.id}`} alt="" loading="lazy" />
                    {s.label}
                  </span>
                ))}
              </div>
            </FadeInSection>

            {/* Skills categories */}
            <StaggerContainer className="divide-y" style={{ borderColor: "var(--border-color)" }}>
              {skills.map((skill) => (
                <StaggerItem
                  key={skill.category}
                  className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 py-5 row-hover -mx-3 px-3"
                >
                  <div className="meta-label shrink-0 md:w-40">{skill.category}</div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                    {skill.items.map((item) => (
                      <span key={item} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>

          {/* Works Section */}
          <section id="works" className="py-24 border-t" style={{ borderColor: "var(--border-color)" }}>
            <SectionHeading index="04" title="Selected Works" track="Track D — Demos" />

            {/* Tech filter chips */}
            <FadeInSection delay={0.05}>
              <div className="flex flex-wrap gap-2 mb-12">
                <button
                  onClick={() => {
                    setActiveFilter(null);
                    setExpandedIndex(null);
                  }}
                  className="chip"
                  data-active={activeFilter === null}
                >
                  All
                </button>
                {allTechs.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => {
                      setActiveFilter(activeFilter === tech ? null : tech);
                      setExpandedIndex(null);
                    }}
                    className="chip"
                    data-active={activeFilter === tech}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </FadeInSection>

            <div className="grid">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => {
                  const idx = projects.indexOf(project);
                  const isExpanded = expandedIndex === idx;
                  return (
                    <motion.article
                      key={project.title}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3 }}
                      className="border-b"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <button
                        className="w-full text-left py-7 px-3 -mx-3 row-hover cursor-pointer group"
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        aria-expanded={isExpanded}
                      >
                        <div className="grid md:grid-cols-12 gap-4 md:gap-8 items-start">
                          <div className="md:col-span-3">
                            <div className="meta-label mb-2">{project.year}</div>
                            <h3
                              className="font-display text-lg md:text-xl tracking-tight transition-colors duration-200"
                              style={{ color: isExpanded ? "var(--accent)" : "var(--text-primary)" }}
                            >
                              {project.title}
                            </h3>
                          </div>
                          <div className="md:col-span-8">
                            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {project.technologies.map((tech) => (
                                <span key={tech} className="meta-label" style={{ letterSpacing: "0.08em" }}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="hidden md:flex md:col-span-1 justify-end pt-1">
                            <ChevronDown
                              className="w-4 h-4 transition-transform duration-300"
                              style={{
                                color: "var(--text-tertiary)",
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                              }}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </button>

                      {/* Expandable detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="pb-8 flex flex-wrap justify-between items-center gap-4">
                              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                View the full source code and documentation on GitHub.
                              </p>
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost text-sm"
                              >
                                View on GitHub <ArrowUpRight className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-24 border-t" style={{ borderColor: "var(--border-color)" }}>
            <SectionHeading index="05" title="Contact" track="Open floor — Q&A" />
            <FadeInSection delay={0.1}>
              <div className="ticket grid md:grid-cols-12">
                <div className="md:col-span-7 p-7 md:p-10">
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <span className="session-tag">Admit one</span>
                    <span className="meta-label">No. 0001 · Open invitation</span>
                  </div>
                  <p className="font-display text-2xl md:text-3xl mb-6" style={{ lineHeight: 1.15 }}>
                    Let&apos;s build something that feels like the future.
                  </p>
                  <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                    I&apos;m always interested in discussing new opportunities, collaborations, or just having a
                    conversation about technology and software development.
                  </p>
                  <a href="mailto:regeecasana57@gmail.com" className="btn-ink">
                    Send a transmission <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="ticket-stub md:col-span-5 p-7 md:p-10 space-y-5">
                  {[
                    { label: "Email", href: "mailto:regeecasana57@gmail.com", text: "regeecasana57@gmail.com" },
                    { label: "LinkedIn", href: "https://linkedin.com/in/rekasa", text: "linkedin.com/in/rekasa" },
                    { label: "GitHub", href: "https://github.com/rekasa7000", text: "github.com/rekasa7000" },
                    { label: "Twitter", href: "https://x.com/regeewashere", text: "@regeewashere" },
                  ].map((c) => (
                    <div key={c.label} className="flex flex-col gap-1 text-sm">
                      <span className="meta-label">{c.label}</span>
                      <a
                        href={c.href}
                        target={c.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="contact-link self-start break-all"
                      >
                        {c.text}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12" style={{ borderColor: "var(--border-color)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4">
          <div className="meta-label">© 2024 Regee Casaña · End of transmission</div>
          <div className="flex items-center gap-5">
            <span className="meta-label">Playground</span>
            {["piano", "matrix", "snake", "farm"].map((slug) => (
              <Link
                key={slug}
                href={`/artifacts/${slug}`}
                className="link-underline meta-label"
                style={{ color: "var(--text-secondary)" }}
              >
                {slug}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
