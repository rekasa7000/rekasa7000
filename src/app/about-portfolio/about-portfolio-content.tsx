"use client";

import { Header } from "@/components/header";
import { FadeInSection } from "@/components/motion-wrappers";

function ProseSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <FadeInSection>
      <div className="grid md:grid-cols-12 gap-4 md:gap-8">
        <h2 className="font-display text-2xl md:col-span-4">{title}</h2>
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

function TechCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="border rounded-lg p-5 md:p-6"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}
    >
      <h3 className="meta-label mb-4" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      <ul className="space-y-3 text-sm md:text-[15px]" style={{ color: "var(--text-secondary)" }}>
        {children}
      </ul>
    </div>
  );
}

function DefItem({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <li>
      <strong style={{ color: "var(--text-primary)" }}>{term}</strong>
      <br />
      {children}
    </li>
  );
}

export function AboutPortfolioContent() {
  return (
    <div
      className="min-h-screen relative transition-colors duration-300"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <Header activePage="about-portfolio" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:pt-28 md:pb-20 border-b" style={{ borderColor: "var(--border-color)" }}>
          <div className="max-w-3xl">
            <p className="meta-label mb-6" style={{ color: "var(--accent)" }}>
              <span className="font-jp normal-case tracking-normal">ポートフォリオについて</span>
            </p>
            <h1 className="font-display text-4xl md:text-6xl leading-tight mb-6">About Portfolio</h1>
            <p className="text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
              The technologies, design decisions, and philosophy behind this portfolio website.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16 md:py-24 space-y-16 md:space-y-24">
          <ProseSection title="Technologies Used">
            <div className="space-y-5">
              <TechCard title="Core Technologies">
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Next.js</strong> - React framework for server-side
                  rendering and optimal performance
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>React</strong> - JavaScript library for building
                  user interfaces with component architecture
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>TypeScript</strong> - Type-safe JavaScript for
                  better development experience
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Tailwind CSS</strong> - Utility-first CSS framework
                  for rapid styling
                </li>
              </TechCard>

              <TechCard title="Design & Assets">
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>JetBrains Mono</strong> - Clean, professional
                  monospace typography
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Skillicons.dev</strong> - Technology stack
                  visualization icons
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Lucide Icons</strong> - Minimal, consistent icon
                  system
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>shadcn/ui</strong> - Accessible, customizable UI
                  components
                </li>
              </TechCard>

              <TechCard title="Development Tools">
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Bun</strong> - Fast JavaScript runtime and package
                  manager
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>ESLint</strong> - Code quality and consistency
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Git</strong> - Version control and collaboration
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>VS Code</strong> - Development environment
                </li>
              </TechCard>
            </div>
          </ProseSection>

          <ProseSection title="Reasons for Creation">
            <p>This portfolio was created to serve multiple purposes beyond just showcasing my work:</p>
            <ul className="space-y-4">
              <DefItem term="Professional Showcase">
                A clean, professional presentation of my skills, experience, and projects that reflects my attention
                to detail and design sensibility.
              </DefItem>
              <DefItem term="Technical Demonstration">
                An opportunity to demonstrate proficiency with modern web technologies and development practices in a
                real-world application.
              </DefItem>
              <DefItem term="Learning Laboratory">
                A platform for experimenting with new technologies, design patterns, and development approaches in a
                controlled environment.
              </DefItem>
              <DefItem term="Design Philosophy Expression">
                A manifestation of my belief in minimalist design, user-centric development, and the importance of
                performance and accessibility.
              </DefItem>
            </ul>
          </ProseSection>

          <ProseSection title="Design Philosophy">
            <p>
              This portfolio follows Japanese minimalist design principles, heavily inspired by designers like Keisuke
              Watanuki. The design emphasizes clean typography, generous white space, and purposeful interactions.
            </p>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              Key design principles:
            </p>
            <ul className="space-y-2.5">
              <li>
                <strong style={{ color: "var(--text-primary)" }}>
                  Ma <span className="font-jp">(間)</span>
                </strong>{" "}
                - Strategic use of negative space
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>
                  Kanso <span className="font-jp">(簡素)</span>
                </strong>{" "}
                - Simplicity and elimination of clutter
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>
                  Shibui <span className="font-jp">(渋い)</span>
                </strong>{" "}
                - Understated elegance
              </li>
              <li>
                <strong style={{ color: "var(--text-primary)" }}>Functional Beauty</strong> - Every element serves a
                specific purpose
              </li>
            </ul>
            <p>
              The monochromatic color scheme, clean typography, and minimal interactions create a professional
              atmosphere that puts content first while maintaining visual interest through subtle hover effects and
              thoughtful spacing.
            </p>
          </ProseSection>

          <ProseSection title="Technical Approach">
            <p>The portfolio was built with performance, accessibility, and maintainability as core priorities:</p>
            <ul className="space-y-4">
              <DefItem term="Performance First">
                Server-side rendering with Next.js ensures fast initial load times and excellent SEO. Images are
                optimized and lazy-loaded where appropriate.
              </DefItem>
              <DefItem term="Accessibility">
                Semantic HTML structure, proper heading hierarchy, and keyboard navigation support ensure the site is
                usable by everyone.
              </DefItem>
              <DefItem term="Responsive Design">
                Mobile-first approach with careful attention to typography scaling and touch interactions across all
                device sizes.
              </DefItem>
              <DefItem term="Developer Experience">
                TypeScript provides type safety, while ESLint maintains code quality and consistency throughout
                development.
              </DefItem>
            </ul>
          </ProseSection>

          <ProseSection title="Future Development">
            <p>This portfolio is a living project that continues to evolve. Planned improvements include:</p>
            <ul className="space-y-4">
              <DefItem term="Blog Section">
                A dedicated space for technical articles, tutorials, and thoughts on software development and design.
              </DefItem>
              <DefItem term="Dark Mode">
                An elegant dark theme option that maintains the minimalist aesthetic while providing a comfortable
                viewing experience in low-light conditions.
              </DefItem>
              <DefItem term="Interactive Project Demos">
                Embedded demos and detailed case studies for selected projects to provide deeper insights into the
                development process.
              </DefItem>
              <DefItem term="Performance Optimizations">
                Continuous improvements to loading times, bundle size, and user experience metrics.
              </DefItem>
            </ul>
            <p>
              The portfolio itself serves as a continuous learning project and showcase of evolving technical skills.
              Each update reflects new knowledge and improved development practices.
            </p>
          </ProseSection>

          <ProseSection title="Conclusion">
            <p className="font-jp">
              このポートフォリオそのものも制作物の1つと捉えています。
              <em className="font-sans block mt-1 text-sm">(I consider this portfolio itself as one of my works.)</em>
            </p>
            <p>
              More than just a showcase, this portfolio represents my approach to software development: thoughtful
              planning, careful execution, and continuous improvement. It demonstrates not just what I can build, but
              how I think about problems and solutions.
            </p>
          </ProseSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "var(--border-color)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
            © 2024 Regee Casaña
          </div>
        </div>
      </footer>
    </div>
  );
}
