"use client";

import Image from "next/image";
import { Header } from "@/components/header";
import { FadeInSection } from "@/components/motion-wrappers";
import { BlockHeading } from "@/components/showcase/about-me-visuals";
import {
  APPROACH_TILES,
  DesignSpecimen,
  IconTiles,
  PURPOSE_TILES,
  Roadmap,
  StackLayers,
} from "@/components/showcase/about-portfolio-visuals";

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

function TechCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="panel p-5 md:p-6">
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
        <section className="pt-16 pb-16 md:pt-24 md:pb-20">
          <div className="max-w-3xl">
            <p className="meta-label mb-8 flex items-center gap-4" style={{ color: "var(--accent)" }}>
              <span className="session-tag">Colophon</span>
              <span className="font-jp normal-case tracking-normal">ポートフォリオについて</span>
            </p>
            <h1 className="font-display text-5xl md:text-7xl mb-8">About Portfolio</h1>
            <p className="text-lg md:text-xl max-w-md" style={{ color: "var(--text-secondary)" }}>
              How this site is built, why it exists, and where it&apos;s going. Take it apart.
            </p>
          </div>
          <FadeInSection>
            <figure className="mt-14">
              <div className="print-frame">
                <Image
                  src="/images/shed.webp"
                  alt="Storybook illustration of a garden shed workbench with seed packets and tools on a pegboard, seedlings in pots, and a drawing of a flowering planet under a lamp, with Earth and a ringed planet outside the window"
                  width={1664}
                  height={928}
                  priority
                  sizes="(min-width: 1024px) 976px, 100vw"
                  className="w-full h-auto block"
                />
              </div>
              <figcaption className="meta-label mt-5 text-right">Plate III — The potting shed</figcaption>
            </figure>
          </FadeInSection>
        </section>

        <section className="py-16 md:py-20 border-t" style={{ borderColor: "var(--border-color)" }}>
          <BlockHeading tag="Part 01" title="The stack" note="Technologies used" />
          <StackLayers />
        </section>

        <section className="py-16 md:py-20 border-t" style={{ borderColor: "var(--border-color)" }}>
          <BlockHeading tag="Part 02" title="Why it exists" note="Four jobs" />
          <IconTiles tiles={PURPOSE_TILES} />
        </section>

        <section className="py-16 md:py-20 border-t" style={{ borderColor: "var(--border-color)" }}>
          <BlockHeading tag="Part 03" title="Design system" note="Live specimen" />
          <DesignSpecimen />
        </section>

        <section className="py-16 md:py-20 border-t" style={{ borderColor: "var(--border-color)" }}>
          <BlockHeading tag="Part 04" title="How it's built" note="Technical approach" />
          <IconTiles tiles={APPROACH_TILES} />
        </section>

        <section className="py-16 md:py-20 border-t" style={{ borderColor: "var(--border-color)" }}>
          <BlockHeading tag="Part 05" title="Planting next" note="Roadmap" />
          <Roadmap />
        </section>

        <section className="py-16 md:py-20 border-t" style={{ borderColor: "var(--border-color)" }}>
          <FadeInSection>
            <figure className="farm-card p-8 md:p-12">
              <blockquote className="font-jp text-2xl md:text-4xl font-bold" style={{ lineHeight: 1.4 }}>
                このポートフォリオそのものも制作物の1つと捉えています。
              </blockquote>
              <figcaption
                className="font-display text-base md:text-xl mt-6"
                style={{ color: "var(--accent)", lineHeight: 1.2 }}
              >
                I consider this portfolio itself one of my works.
              </figcaption>
            </figure>
          </FadeInSection>
        </section>

        <details className="longform">
          <summary>
            <span className="font-display text-xl md:text-2xl">Read the long version</span>
          </summary>
          {/* Content Sections */}
          <section className="pt-8 pb-16 md:pb-24 space-y-16 md:space-y-24">
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
                    <strong style={{ color: "var(--text-primary)" }}>Fraunces, Space Grotesk, Space Mono</strong> -
                    Display, reading and label typefaces
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
                  A manifestation of my belief in purposeful design, user-centric development, and the importance of
                  performance and accessibility.
                </DefItem>
              </ul>
            </ProseSection>

            <ProseSection title="Design Philosophy">
              <p>
                This portfolio is drawn as a small homestead on a small planet: flowers, farm plots and a farmhouse, out
                among the stars. It is the two halves of me in one picture. I build software, and one day I want to
                trade the keyboard for a watering can.
              </p>
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                Key design principles:
              </p>
              <ul className="space-y-2.5">
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Flowers first, tech as the soil</strong> - Space and
                  technology are the setting; the garden is the subject
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Everything grows</strong> - Careers, skills and
                  projects are shown as things that were planted and tended
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Warm, never cold</strong> - Cream paper, terracotta,
                  leaf green and petal pink instead of chrome and neon
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Room to breathe</strong> - Fewer words, more pictures
                </li>
              </ul>
              <p>
                Type is set in Fraunces for display, Space Grotesk for reading and Space Mono for small labels. Flowers
                grow as you scroll and sway gently; all of it stops for anyone who prefers reduced motion. The three
                storybook plates were generated with Qwen-Image on Hugging Face; everything that moves is drawn in code.
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
        </details>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12" style={{ borderColor: "var(--border-color)" }}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="meta-label">© 2024 Regee Casaña · Grown with care</div>
        </div>
      </footer>
    </div>
  );
}
