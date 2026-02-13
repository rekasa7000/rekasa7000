"use client";

import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { Header } from "@/components/header";

export function AboutPortfolioContent() {
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
      <Header activePage="about-portfolio" />

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
              About Portfolio{" "}
              <span className="text-sm md:text-xl neon-accent ml-2">
                ポートフォリオについて
              </span>
            </h1>
            <p
              className="text-base md:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              The technologies, design decisions, and philosophy behind this
              portfolio website.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-12 md:py-20">
          <div className="max-w-4xl space-y-12 md:space-y-16">
            {/* Technologies Used */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Technologies Used
              </h2>
              <div className="space-y-4 md:space-y-6">
                <div
                  className="border p-4 md:p-6"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">
                    Core Technologies
                  </h3>
                  <ul
                    className="space-y-2 md:space-y-3 text-sm md:text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <li>
                      <strong>Next.js</strong> - React framework for
                      server-side rendering and optimal performance
                    </li>
                    <li>
                      <strong>React</strong> - JavaScript library for building
                      user interfaces with component architecture
                    </li>
                    <li>
                      <strong>TypeScript</strong> - Type-safe JavaScript for
                      better development experience
                    </li>
                    <li>
                      <strong>Tailwind CSS</strong> - Utility-first CSS
                      framework for rapid styling
                    </li>
                  </ul>
                </div>

                <div
                  className="border p-4 md:p-6"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">
                    Design & Assets
                  </h3>
                  <ul
                    className="space-y-2 md:space-y-3 text-sm md:text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <li>
                      <strong>JetBrains Mono</strong> - Clean, professional
                      monospace typography
                    </li>
                    <li>
                      <strong>Skillicons.dev</strong> - Technology stack
                      visualization icons
                    </li>
                    <li>
                      <strong>Lucide Icons</strong> - Minimal, consistent icon
                      system
                    </li>
                    <li>
                      <strong>shadcn/ui</strong> - Accessible, customizable UI
                      components
                    </li>
                  </ul>
                </div>

                <div
                  className="border p-4 md:p-6"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">
                    Development Tools
                  </h3>
                  <ul
                    className="space-y-2 md:space-y-3 text-sm md:text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <li>
                      <strong>Bun</strong> - Fast JavaScript runtime and
                      package manager
                    </li>
                    <li>
                      <strong>ESLint</strong> - Code quality and consistency
                    </li>
                    <li>
                      <strong>Git</strong> - Version control and collaboration
                    </li>
                    <li>
                      <strong>VS Code</strong> - Development environment
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reasons for Creation */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Reasons for Creation
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  This portfolio was created to serve multiple purposes beyond
                  just showcasing my work:
                </p>
                <ul className="space-y-3 md:space-y-4 ml-4 md:ml-6">
                  <li>
                    <strong>• Professional Showcase</strong>
                    <br />A clean, professional presentation of my skills,
                    experience, and projects that reflects my attention to
                    detail and design sensibility.
                  </li>
                  <li>
                    <strong>• Technical Demonstration</strong>
                    <br />
                    An opportunity to demonstrate proficiency with modern web
                    technologies and development practices in a real-world
                    application.
                  </li>
                  <li>
                    <strong>• Learning Laboratory</strong>
                    <br />A platform for experimenting with new technologies,
                    design patterns, and development approaches in a controlled
                    environment.
                  </li>
                  <li>
                    <strong>• Design Philosophy Expression</strong>
                    <br />A manifestation of my belief in minimalist design,
                    user-centric development, and the importance of performance
                    and accessibility.
                  </li>
                </ul>
              </div>
            </div>

            {/* Design Philosophy */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Design Philosophy
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  This portfolio follows Japanese minimalist design principles,
                  heavily inspired by designers like Keisuke Watanuki. The
                  design emphasizes clean typography, generous white space, and
                  purposeful interactions.
                </p>
                <p>
                  <strong>Key design principles:</strong>
                </p>
                <ul className="space-y-2 ml-4 md:ml-6">
                  <li>
                    • <strong>Ma (間)</strong> - Strategic use of negative space
                  </li>
                  <li>
                    • <strong>Kanso (簡素)</strong> - Simplicity and elimination
                    of clutter
                  </li>
                  <li>
                    • <strong>Shibui (渋い)</strong> - Understated elegance
                  </li>
                  <li>
                    • <strong>Functional Beauty</strong> - Every element serves
                    a specific purpose
                  </li>
                </ul>
                <p>
                  The monochromatic color scheme, clean typography, and minimal
                  interactions create a professional atmosphere that puts
                  content first while maintaining visual interest through subtle
                  hover effects and thoughtful spacing.
                </p>
              </div>
            </div>

            {/* Technical Approach */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Technical Approach
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  The portfolio was built with performance, accessibility, and
                  maintainability as core priorities:
                </p>
                <ul className="space-y-3 md:space-y-4 ml-4 md:ml-6">
                  <li>
                    <strong>• Performance First</strong>
                    <br />
                    Server-side rendering with Next.js ensures fast initial
                    load times and excellent SEO. Images are optimized and
                    lazy-loaded where appropriate.
                  </li>
                  <li>
                    <strong>• Accessibility</strong>
                    <br />
                    Semantic HTML structure, proper heading hierarchy, and
                    keyboard navigation support ensure the site is usable by
                    everyone.
                  </li>
                  <li>
                    <strong>• Responsive Design</strong>
                    <br />
                    Mobile-first approach with careful attention to typography
                    scaling and touch interactions across all device sizes.
                  </li>
                  <li>
                    <strong>• Developer Experience</strong>
                    <br />
                    TypeScript provides type safety, while ESLint maintains
                    code quality and consistency throughout development.
                  </li>
                </ul>
              </div>
            </div>

            {/* Future Development */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Future Development
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  This portfolio is a living project that continues to evolve.
                  Planned improvements include:
                </p>
                <ul className="space-y-3 md:space-y-4 ml-4 md:ml-6">
                  <li>
                    <strong>• Blog Section</strong>
                    <br />A dedicated space for technical articles, tutorials,
                    and thoughts on software development and design.
                  </li>
                  <li>
                    <strong>• Dark Mode</strong>
                    <br />
                    An elegant dark theme option that maintains the minimalist
                    aesthetic while providing a comfortable viewing experience
                    in low-light conditions.
                  </li>
                  <li>
                    <strong>• Interactive Project Demos</strong>
                    <br />
                    Embedded demos and detailed case studies for selected
                    projects to provide deeper insights into the development
                    process.
                  </li>
                  <li>
                    <strong>• Performance Optimizations</strong>
                    <br />
                    Continuous improvements to loading times, bundle size, and
                    user experience metrics.
                  </li>
                </ul>
                <p>
                  The portfolio itself serves as a continuous learning project
                  and showcase of evolving technical skills. Each update
                  reflects new knowledge and improved development practices.
                </p>
              </div>
            </div>

            {/* Conclusion */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
                Conclusion
              </h2>
              <div
                className="space-y-4 md:space-y-6 leading-relaxed text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                <p>
                  このポートフォリオそのものも制作物の1つと捉えています。
                  <em>
                    (I consider this portfolio itself as one of my works.)
                  </em>
                </p>
                <p>
                  More than just a showcase, this portfolio represents my
                  approach to software development: thoughtful planning, careful
                  execution, and continuous improvement. It demonstrates not
                  just what I can build, but how I think about problems and
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
