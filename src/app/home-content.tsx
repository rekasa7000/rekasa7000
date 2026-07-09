"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Header } from "@/components/header";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/motion-wrappers";
import { AnimatedTimeline } from "@/components/animated-timeline";
import {
  homeProjects as projects,
  homeExperience as experienceEntries,
  homeEducation as educationEntries,
  homeSkills as skills,
  SKILL_ICONS,
} from "@/lib/career-data";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/rekasa7000" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rekasa" },
  { label: "Twitter", href: "https://x.com/regeewashere" },
  { label: "Email", href: "mailto:regeecasana57@gmail.com" },
];

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <FadeInSection>
      <div className="section-rule mb-14">
        <span className="meta-label" style={{ color: "var(--accent)" }}>
          {index}
        </span>
        <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      </div>
    </FadeInSection>
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
      <main className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-24 pb-28 md:pt-36 md:pb-44">
          {/* Quiet vertical Japanese name — decorative, md+ only */}
          <motion.div
            className="font-jp hidden md:block absolute right-0 top-32 text-lg select-none"
            style={{ writingMode: "vertical-rl", color: "var(--text-tertiary)", letterSpacing: "0.35em" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            aria-hidden="true"
          >
            レジー・カサーニャ
          </motion.div>

          <motion.p
            className="meta-label mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Software Engineer — Philippines
          </motion.p>

          <motion.h1
            className="font-display text-5xl md:text-8xl leading-[1.05] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Regee
            <br />
            Casaña
            <span
              className="font-jp text-base md:text-xl block mt-4 md:hidden"
              style={{ color: "var(--text-tertiary)" }}
            >
              レジー・カサーニャ
            </span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg mb-8"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Software Engineer · Full-stack Developer · Technical Architect
          </motion.p>

          <motion.p
            className="max-w-xl text-base leading-relaxed mb-12"
            style={{ color: "var(--text-secondary)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Based in the Philippines, building web products that people actually enjoy using — with an obsession for
            clean code and good UX.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Link href="/about-me" className="btn-ink">
              About Me
            </Link>
            <Link href="/about-portfolio" className="btn-ghost">
              About Portfolio
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-6 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="link-underline meta-label"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        </section>

        {/* Experience Section */}
        <section className="py-24 border-t" id="experience" style={{ borderColor: "var(--border-color)" }}>
          <SectionHeading index="01" title="Experience" />
          <AnimatedTimeline entries={experienceEntries} />
        </section>

        {/* Education Section */}
        <section className="py-24 border-t" id="education" style={{ borderColor: "var(--border-color)" }}>
          <SectionHeading index="02" title="Education" />
          <AnimatedTimeline entries={educationEntries} />
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-24 border-t" style={{ borderColor: "var(--border-color)" }}>
          <SectionHeading index="03" title="Skills & Technologies" />

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
          <SectionHeading index="04" title="Selected Works" />

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
                            className="font-display text-xl transition-colors duration-200"
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
          <SectionHeading index="05" title="Contact" />
          <FadeInSection delay={0.1}>
            <div className="grid md:grid-cols-2 gap-12">
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                I&apos;m always interested in discussing new opportunities, collaborations, or just having a
                conversation about technology and software development.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 text-sm items-baseline">
                  <span className="meta-label w-20 shrink-0">Email</span>
                  <a href="mailto:regeecasana57@gmail.com" className="contact-link">
                    regeecasana57@gmail.com
                  </a>
                </div>
                <div className="flex gap-4 text-sm items-baseline">
                  <span className="meta-label w-20 shrink-0">LinkedIn</span>
                  <a
                    href="https://linkedin.com/in/rekasa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    linkedin.com/in/rekasa
                  </a>
                </div>
                <div className="flex gap-4 text-sm items-baseline">
                  <span className="meta-label w-20 shrink-0">GitHub</span>
                  <a
                    href="https://github.com/rekasa7000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    github.com/rekasa7000
                  </a>
                </div>
                <div className="flex gap-4 text-sm items-baseline">
                  <span className="meta-label w-20 shrink-0">Twitter</span>
                  <a
                    href="https://x.com/regeewashere"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    @regeewashere
                  </a>
                </div>
              </div>
            </div>
          </FadeInSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "var(--border-color)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            © 2024 Regee Casaña
          </div>
          <div className="flex items-center gap-5">
            <span className="meta-label">Playground</span>
            {["piano", "matrix", "snake", "farm"].map((slug) => (
              <Link
                key={slug}
                href={`/artifacts/${slug}`}
                className="link-underline text-sm"
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
