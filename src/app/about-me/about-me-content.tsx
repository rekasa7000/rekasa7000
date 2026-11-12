"use client";

import { Header } from "@/components/header";
import { FadeInSection } from "@/components/motion-wrappers";

function ProseSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <FadeInSection>
      <div className="grid md:grid-cols-12 gap-4 md:gap-8">
        <h2 className="font-display text-xl md:text-2xl tracking-tight md:col-span-4">{title}</h2>
        <div
          className="md:col-span-8 space-y-5 leading-relaxed text-[15px] md:text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          {children}
        </div>
      </div>
    </FadeInSection>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="font-mono text-xs mt-1 shrink-0" style={{ color: "var(--accent)" }} aria-hidden="true">
        ›
      </span>
      <span>{children}</span>
    </li>
  );
}

export function AboutMeContent() {
  return (
    <div
      className="min-h-screen relative transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <Header activePage="about-me" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:pt-28 md:pb-20 border-b" style={{ borderColor: "var(--border-color)" }}>
          <div className="max-w-3xl">
            <p className="meta-label mb-8 flex items-center gap-4" style={{ color: "var(--accent)" }}>
              <span className="session-tag">Speaker profile</span>
              <span className="font-jp normal-case tracking-normal">私について</span>
            </p>
            <h1 className="font-display text-5xl md:text-7xl mb-8">About Me</h1>
            <p className="text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
              A deeper look into my background, philosophy, and journey as a software engineer.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16 md:py-24 space-y-16 md:space-y-24">
          <ProseSection title="Background">
            <p>
              I&apos;m a software engineer with a passion for building scalable applications and solving complex
              problems. My journey in technology began during my college years at Bataan Peninsula State University,
              where I graduated Cum Laude with latin honor, specializing in software engineering, algorithms, and system
              design.
            </p>
            <p>
              What started as curiosity about how things work evolved into a deep appreciation for the craft of software
              development. I believe that great software is not just about writing code—it&apos;s about understanding
              problems, designing elegant solutions, and creating value for users.
            </p>
          </ProseSection>

          <ProseSection title="Philosophy">
            <p>
              I believe in writing clean, maintainable code and focusing on user experience. My approach combines
              technical excellence with practical problem-solving, always considering the real-world impact of the
              software I build.
            </p>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              Core principles I follow:
            </p>
            <ul className="space-y-2.5">
              <ListItem>Simplicity over complexity</ListItem>
              <ListItem>User-centric design and development</ListItem>
              <ListItem>Continuous learning and improvement</ListItem>
              <ListItem>Collaborative problem-solving</ListItem>
              <ListItem>Quality over quantity</ListItem>
            </ul>
          </ProseSection>

          <ProseSection title="Current Focus">
            <p>
              Currently, I&apos;m leading a team of three developers at Kloudtech Corp, where we architect and develop
              weather monitoring systems with real-time data collection and IoT integration. This role has taught me the
              importance of balancing technical innovation with practical constraints.
            </p>
            <p>I&apos;m particularly interested in:</p>
            <ul className="space-y-2.5">
              <ListItem>Real-time data processing and visualization</ListItem>
              <ListItem>IoT system architecture and integration</ListItem>
              <ListItem>Team leadership and mentoring</ListItem>
              <ListItem>AI/ML applications in practical software solutions</ListItem>
              <ListItem>Modern web technologies and frameworks</ListItem>
            </ul>
          </ProseSection>

          <ProseSection title="Beyond Code">
            <p>
              When I&apos;m not coding, I enjoy exploring new technologies, contributing to open-source projects, and
              sharing knowledge with the developer community. I&apos;m particularly fascinated by AI/ML applications and
              their potential to solve everyday problems.
            </p>
            <p>
              I also believe in the importance of work-life balance and continuous personal growth. Whether it&apos;s
              learning a new programming language, reading about design principles, or simply taking time to reflect on
              past projects, I&apos;m always looking for ways to improve both professionally and personally.
            </p>
          </ProseSection>

          <ProseSection title="Future Vision">
            <p>
              Looking ahead, I aspire to become a software architect who can bridge the gap between technical excellence
              and business value. I want to build systems that not only solve complex problems but also make a positive
              impact on people&apos;s lives.
            </p>
            <p>
              My long-term goals include mentoring the next generation of developers, contributing to meaningful
              open-source projects, and perhaps starting my own technology company focused on solving real-world
              problems through innovative software solutions.
            </p>
          </ProseSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12" style={{ borderColor: "var(--border-color)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="meta-label">© 2024 Regee Casaña · End of transmission</div>
        </div>
      </footer>
    </div>
  );
}
