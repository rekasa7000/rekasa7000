<script setup lang="ts">
useSeoMeta({
  title: "About Portfolio - Regee Casaña",
  description: "Learn about the technologies, design decisions, and philosophy behind this portfolio",
});
</script>

<template>
  <div class="min-h-screen bg-white text-black font-mono">
    <!-- Header -->
    <header class="z-50 w-full border-b border-gray-200">
      <div class="w-full px-4 md:px-6 py-4 md:py-6">
        <div class="flex items-center justify-between max-w-6xl mx-auto">
          <a href="/" class="text-lg md:text-xl font-bold hover:underline">Regee Casaña</a>
          <div class="flex gap-4 md:gap-8 text-xs md:text-sm">
            <a href="/" class="hover:underline">Home</a>
            <a href="/about-me" class="hover:underline hidden sm:block">About Me</a>
            <a href="/about-portfolio" class="hover:underline font-semibold">About Portfolio</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 md:px-6">
      <!-- Hero Section -->
      <section class="py-12 md:py-20 border-b border-gray-200">
        <div class="max-w-4xl">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight">About Portfolio</h1>
          <p class="text-base md:text-lg text-gray-600">
            The technologies, design decisions, and philosophy behind this portfolio website.
          </p>
        </div>
      </section>

      <!-- Content Sections -->
      <section class="py-12 md:py-20">
        <div class="max-w-4xl space-y-12 md:space-y-16">
          <!-- Technologies Used -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Technologies Used</h2>
            <div class="space-y-4 md:space-y-6">
              <div class="border border-gray-200 p-4 md:p-6">
                <h3 class="font-semibold mb-3 md:mb-4 text-sm md:text-base">Core Technologies</h3>
                <ul class="text-gray-600 space-y-2 md:space-y-3 text-sm md:text-base">
                  <li>
                    <strong>Nuxt.js 3</strong> - Vue.js framework for server-side rendering and optimal performance
                  </li>
                  <li><strong>Vue.js 3</strong> - Progressive JavaScript framework with Composition API</li>
                  <li><strong>TypeScript</strong> - Type-safe JavaScript for better development experience</li>
                  <li><strong>Tailwind CSS</strong> - Utility-first CSS framework for rapid styling</li>
                </ul>
              </div>

              <div class="border border-gray-200 p-4 md:p-6">
                <h3 class="font-semibold mb-3 md:mb-4 text-sm md:text-base">Design & Assets</h3>
                <ul class="text-gray-600 space-y-2 md:space-y-3 text-sm md:text-base">
                  <li><strong>JetBrains Mono</strong> - Clean, professional monospace typography</li>
                  <li><strong>Skillicons.dev</strong> - Technology stack visualization icons</li>
                  <li><strong>Lucide Icons</strong> - Minimal, consistent icon system</li>
                  <li><strong>GSAP</strong> - Professional animations and interactions</li>
                </ul>
              </div>

              <div class="border border-gray-200 p-4 md:p-6">
                <h3 class="font-semibold mb-3 md:mb-4 text-sm md:text-base">Development Tools</h3>
                <ul class="text-gray-600 space-y-2 md:space-y-3 text-sm md:text-base">
                  <li><strong>Vite</strong> - Fast build tool and development server</li>
                  <li><strong>ESLint</strong> - Code quality and consistency</li>
                  <li><strong>Git</strong> - Version control and collaboration</li>
                  <li><strong>VS Code</strong> - Development environment</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Reasons for Creation -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Reasons for Creation</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>This portfolio was created to serve multiple purposes beyond just showcasing my work:</p>
              <ul class="space-y-3 md:space-y-4 ml-4 md:ml-6">
                <li>
                  <strong>• Professional Showcase</strong><br />
                  A clean, professional presentation of my skills, experience, and projects that reflects my attention
                  to detail and design sensibility.
                </li>
                <li>
                  <strong>• Technical Demonstration</strong><br />
                  An opportunity to demonstrate proficiency with modern web technologies and development practices in a
                  real-world application.
                </li>
                <li>
                  <strong>• Learning Laboratory</strong><br />
                  A platform for experimenting with new technologies, design patterns, and development approaches in a
                  controlled environment.
                </li>
                <li>
                  <strong>• Design Philosophy Expression</strong><br />
                  A manifestation of my belief in minimalist design, user-centric development, and the importance of
                  performance and accessibility.
                </li>
              </ul>
            </div>
          </div>

          <!-- Design Philosophy -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Design Philosophy</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                This portfolio follows Japanese minimalist design principles, heavily inspired by designers like Keisuke
                Watanuki. The design emphasizes clean typography, generous white space, and purposeful interactions.
              </p>
              <p>
                <strong>Key design principles:</strong>
              </p>
              <ul class="space-y-2 ml-4 md:ml-6">
                <li>• <strong>Ma (間)</strong> - Strategic use of negative space</li>
                <li>• <strong>Kanso (簡素)</strong> - Simplicity and elimination of clutter</li>
                <li>• <strong>Shibui (渋い)</strong> - Understated elegance</li>
                <li>• <strong>Functional Beauty</strong> - Every element serves a specific purpose</li>
              </ul>
              <p>
                The monochromatic color scheme, clean typography, and minimal interactions create a professional
                atmosphere that puts content first while maintaining visual interest through subtle hover effects and
                thoughtful spacing.
              </p>
            </div>
          </div>

          <!-- Technical Approach -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Technical Approach</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>The portfolio was built with performance, accessibility, and maintainability as core priorities:</p>
              <ul class="space-y-3 md:space-y-4 ml-4 md:ml-6">
                <li>
                  <strong>• Performance First</strong><br />
                  Server-side rendering with Nuxt.js ensures fast initial load times and excellent SEO. Images are
                  optimized and lazy-loaded where appropriate.
                </li>
                <li>
                  <strong>• Accessibility</strong><br />
                  Semantic HTML structure, proper heading hierarchy, and keyboard navigation support ensure the site is
                  usable by everyone.
                </li>
                <li>
                  <strong>• Responsive Design</strong><br />
                  Mobile-first approach with careful attention to typography scaling and touch interactions across all
                  device sizes.
                </li>
                <li>
                  <strong>• Developer Experience</strong><br />
                  TypeScript provides type safety, while ESLint and Prettier maintain code quality and consistency
                  throughout development.
                </li>
              </ul>
            </div>
          </div>

          <!-- Future Development -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Future Development</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>This portfolio is a living project that continues to evolve. Planned improvements include:</p>
              <ul class="space-y-3 md:space-y-4 ml-4 md:ml-6">
                <li>
                  <strong>• Blog Section</strong><br />
                  A dedicated space for technical articles, tutorials, and thoughts on software development and design.
                </li>
                <li>
                  <strong>• Dark Mode</strong><br />
                  An elegant dark theme option that maintains the minimalist aesthetic while providing a comfortable
                  viewing experience in low-light conditions.
                </li>
                <li>
                  <strong>• Interactive Project Demos</strong><br />
                  Embedded demos and detailed case studies for selected projects to provide deeper insights into the
                  development process.
                </li>
                <li>
                  <strong>• Performance Optimizations</strong><br />
                  Continuous improvements to loading times, bundle size, and user experience metrics.
                </li>
              </ul>
              <p>
                The portfolio itself serves as a continuous learning project and showcase of evolving technical skills.
                Each update reflects new knowledge and improved development practices.
              </p>
            </div>
          </div>

          <!-- Conclusion -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Conclusion</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                このポートフォリオそのものも制作物の1つと捉えています。
                <em>(I consider this portfolio itself as one of my works.)</em>
              </p>
              <p>
                More than just a showcase, this portfolio represents my approach to software development: thoughtful
                planning, careful execution, and continuous improvement. It demonstrates not just what I can build, but
                how I think about problems and solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 mt-12 md:mt-20">
      <div class="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div class="text-sm text-gray-500">© 2024 Regee Casaña</div>
      </div>
    </footer>
  </div>
</template>

<style>
/* Minimal, clean typography */
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap");

html {
  font-family: "JetBrains Mono", monospace;
  scroll-behavior: smooth;
}

/* Clean, minimal styling */
body {
  line-height: 1.6;
}

/* Hover effects for minimal interactions */
a:hover {
  transition: all 0.2s ease;
}
</style>
