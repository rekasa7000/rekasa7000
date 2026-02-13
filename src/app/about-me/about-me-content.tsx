"use client";

import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { Header } from "@/components/header";

export function AboutMeContent() {
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
      <Header activePage="about-me" />

      {/* Main Content */}
      <main
        className="max-w-6xl mx-auto px-4 md:px-6 relative z-10 backdrop-blur-sm"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* Hero Section */}
        <section
          className="py-12 md:py-20 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight jp-street-text">
              About Me{" "}
              <span className="text-sm md:text-xl neon-accent ml-2">
                私について
              </span>
            </h1>
            <p
              className="text-base md:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              A deeper look into my background, philosophy, and journey as a
              software engineer.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-12 md:py-20">
          <div className="max-w-4xl space-y-12 md:space-y-16">
            {/* Background */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Background
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  I&apos;m a software engineer with a passion for building
                  scalable applications and solving complex problems. My journey
                  in technology began during my college years at Bataan Peninsula
                  State University, where I graduated Cum Laude with latin
                  honor, specializing in software engineering, algorithms, and
                  system design.
                </p>
                <p>
                  What started as curiosity about how things work evolved into a
                  deep appreciation for the craft of software development. I
                  believe that great software is not just about writing
                  code—it&apos;s about understanding problems, designing elegant
                  solutions, and creating value for users.
                </p>
              </div>
            </div>

            {/* Philosophy */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Philosophy
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  I believe in writing clean, maintainable code and focusing on
                  user experience. My approach combines technical excellence with
                  practical problem-solving, always considering the real-world
                  impact of the software I build.
                </p>
                <p>
                  <strong>Core principles I follow:</strong>
                </p>
                <ul className="space-y-2 ml-4 md:ml-6">
                  <li>• Simplicity over complexity</li>
                  <li>• User-centric design and development</li>
                  <li>• Continuous learning and improvement</li>
                  <li>• Collaborative problem-solving</li>
                  <li>• Quality over quantity</li>
                </ul>
              </div>
            </div>

            {/* Current Focus */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Current Focus
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  Currently, I&apos;m leading a team of three developers at
                  Kloudtech Corp, where we architect and develop weather
                  monitoring systems with real-time data collection and IoT
                  integration. This role has taught me the importance of
                  balancing technical innovation with practical constraints.
                </p>
                <p>I&apos;m particularly interested in:</p>
                <ul className="space-y-2 ml-4 md:ml-6">
                  <li>• Real-time data processing and visualization</li>
                  <li>• IoT system architecture and integration</li>
                  <li>• Team leadership and mentoring</li>
                  <li>
                    • AI/ML applications in practical software solutions
                  </li>
                  <li>• Modern web technologies and frameworks</li>
                </ul>
              </div>
            </div>

            {/* Beyond Code */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Beyond Code
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  When I&apos;m not coding, I enjoy exploring new technologies,
                  contributing to open-source projects, and sharing knowledge
                  with the developer community. I&apos;m particularly fascinated
                  by AI/ML applications and their potential to solve everyday
                  problems.
                </p>
                <p>
                  I also believe in the importance of work-life balance and
                  continuous personal growth. Whether it&apos;s learning a new
                  programming language, reading about design principles, or
                  simply taking time to reflect on past projects, I&apos;m
                  always looking for ways to improve both professionally and
                  personally.
                </p>
              </div>
            </div>

            {/* Future Vision */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Future Vision
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  Looking ahead, I aspire to become a software architect who can
                  bridge the gap between technical excellence and business
                  value. I want to build systems that not only solve complex
                  problems but also make a positive impact on people&apos;s
                  lives.
                </p>
                <p>
                  My long-term goals include mentoring the next generation of
                  developers, contributing to meaningful open-source projects,
                  and perhaps starting my own technology company focused on
                  solving real-world problems through innovative software
                  solutions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-12 md:mt-20"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className="text-sm text-gray-500">© 2024 Regee Casaña</div>
        </div>
      </footer>
    </div>
  );
}
