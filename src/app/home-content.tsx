"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { TerminalHero } from "@/components/terminal-hero";
import { FadeInSection, StaggerContainer, StaggerItem } from "@/components/motion-wrappers";
import { AnimatedTimeline } from "@/components/animated-timeline";
import { useModeContext } from "@/components/mode-provider";
import {
  homeProjects as projects,
  homeExperience as experienceEntries,
  homeEducation as educationEntries,
  homeSkills as skills,
  SKILL_ICONS,
  TICKER_TEXT,
} from "@/lib/career-data";


export function HomeContent() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { easterEgg, matchaMode } = useModeContext();

  const allTechs = [...new Set(projects.flatMap((p) => p.technologies))];
  const filteredProjects = activeFilter ? projects.filter((p) => p.technologies.includes(activeFilter)) : projects;

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

      <DarkModeToggle />
      <ScrollIndicator />


      {/* <header
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
      </header> */}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <section className="py-20 md:pt-20 md:pb-40 border-b" style={{ borderColor: "var(--border-color)" }}>
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className={`text-4xl md:text-[7rem] font-bold mb-8 leading-tight jp-street-text${easterEgg ? " easter-egg-glitch" : ""}${matchaMode ? " matcha-glow" : ""}`}>
              Regee
              <br />
              Casaña
              <span className="text-sm md:text-2xl neon-accent block md:inline md:ml-4">レジー・カサーニャ</span>
            </h1>

            <p className="text-base md:text-lg mb-10" style={{ color: "var(--text-secondary)" }}>
              Software Engineer · Full-stack Developer · Technical Architect
            </p>

            <div className="max-w-2xl">
              <TerminalHero />
            </div>
          </motion.div>

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

        {/* Role marquee ticker */}
        <div className="overflow-hidden border-b" style={{ borderColor: "var(--border-color)" }}>
          <div className="marquee-inner py-2 gap-0">
            <span className="text-xs uppercase tracking-widest whitespace-nowrap px-8" style={{ color: "var(--text-secondary)" }}>{TICKER_TEXT} ·&nbsp;</span>
            <span className="text-xs uppercase tracking-widest whitespace-nowrap px-8" style={{ color: "var(--text-secondary)" }}>{TICKER_TEXT} ·&nbsp;</span>
          </div>
        </div>

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

          {/* Tech Icons Grid — expandable pill style (hover to reveal name) */}
          <FadeInSection>
            <div className="mb-16 flex flex-wrap gap-3">
              {SKILL_ICONS.map((s) => (
                <div key={s.id} className={`tech-icon ${s.category}`}>
                  <img
                    src={`https://skillicons.dev/icons?i=${s.id}`}
                    alt={s.label}
                    className="w-8 h-8"
                  />
                  <span className="tech-tooltip">{s.label}</span>
                </div>
              ))}
            </div>
          </FadeInSection>

          {/* Skills Categories — table layout */}
          <StaggerContainer className="divide-y" style={{ borderColor: "var(--border-color)" }}>
            {skills.map((skill) => (
              <StaggerItem
                key={skill.category}
                className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 py-4 group transition-colors duration-200 hover:bg-[rgba(74,144,226,0.04)] -mx-3 px-3"
              >
                <div
                  className="text-xs uppercase tracking-widest shrink-0 md:w-36 transition-colors duration-200 group-hover:text-(--water-blue)"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {skill.category}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {skill.items.map((item) => (
                    <span key={item} className="text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Works Section */}
        <section id="works" className="py-20" style={{ borderColor: "var(--border-color)" }}>
          <FadeInSection>
            <h2 className="text-2xl font-bold mb-8">Selected Works</h2>
          </FadeInSection>

          {/* Tech filter pills */}
          <FadeInSection delay={0.05}>
            <div className="flex flex-wrap gap-2 mb-10">
              <button
                onClick={() => {
                  setActiveFilter(null);
                  setExpandedIndex(null);
                }}
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
                  onClick={() => {
                    setActiveFilter(activeFilter === tech ? null : tech);
                    setExpandedIndex(null);
                  }}
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
                    className="py-6 border-b cursor-pointer group"
                    style={{ borderColor: "var(--border-color)" }}
                    whileHover={{ backgroundColor: "rgba(74, 144, 226, 0.04)" }}
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  >
                    <div className="grid md:grid-cols-12 gap-8 items-start relative z-10">
                      <div className="md:col-span-3">
                        <div className="text-sm text-gray-500 mb-2">{project.year}</div>
                        <h3 className="text-xl font-semibold transition-colors duration-200 group-hover:text-(--water-blue)">{project.title}</h3>
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
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
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
