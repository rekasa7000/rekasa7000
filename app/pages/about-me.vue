<script setup lang="ts">
useSeoMeta({
  title: "About Me - Regee Casaña",
  description: "Learn more about my background, philosophy, and journey as a software engineer",
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
            <a href="/about-me" class="hover:underline font-semibold">About Me</a>
            <a href="/about-portfolio" class="hover:underline hidden sm:block">About Portfolio</a>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 md:px-6">
      <!-- Hero Section -->
      <section class="py-12 md:py-20 border-b border-gray-200">
        <div class="max-w-4xl">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight">About Me</h1>
          <p class="text-base md:text-lg text-gray-600">
            A deeper look into my background, philosophy, and journey as a software engineer.
          </p>
        </div>
      </section>

      <!-- Content Sections -->
      <section class="py-12 md:py-20">
        <div class="max-w-4xl space-y-12 md:space-y-16">
          <!-- Background -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Background</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                I'm a software engineer with a passion for building scalable applications and solving complex problems.
                My journey in technology began during my college years at Bataan Peninsula State University, where I
                graduated Cum Laude with latin honor, specializing in software engineering, algorithms, and system
                design.
              </p>
              <p>
                What started as curiosity about how things work evolved into a deep appreciation for the craft of
                software development. I believe that great software is not just about writing code—it's about
                understanding problems, designing elegant solutions, and creating value for users.
              </p>
            </div>
          </div>

          <!-- Philosophy -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Philosophy</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                I believe in writing clean, maintainable code and focusing on user experience. My approach combines
                technical excellence with practical problem-solving, always considering the real-world impact of the
                software I build.
              </p>
              <p>
                <strong>Core principles I follow:</strong>
              </p>
              <ul class="space-y-2 ml-4 md:ml-6">
                <li>• Simplicity over complexity</li>
                <li>• User-centric design and development</li>
                <li>• Continuous learning and improvement</li>
                <li>• Collaborative problem-solving</li>
                <li>• Quality over quantity</li>
              </ul>
            </div>
          </div>

          <!-- Current Focus -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Current Focus</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                Currently, I'm leading a team of three developers at Kloudtech Corp, where we architect and develop
                weather monitoring systems with real-time data collection and IoT integration. This role has taught me
                the importance of balancing technical innovation with practical constraints.
              </p>
              <p>I'm particularly interested in:</p>
              <ul class="space-y-2 ml-4 md:ml-6">
                <li>• Real-time data processing and visualization</li>
                <li>• IoT system architecture and integration</li>
                <li>• Team leadership and mentoring</li>
                <li>• AI/ML applications in practical software solutions</li>
                <li>• Modern web technologies and frameworks</li>
              </ul>
            </div>
          </div>

          <!-- Beyond Code -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Beyond Code</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and
                sharing knowledge with the developer community. I'm particularly fascinated by AI/ML applications and
                their potential to solve everyday problems.
              </p>
              <p>
                I also believe in the importance of work-life balance and continuous personal growth. Whether it's
                learning a new programming language, reading about design principles, or simply taking time to reflect
                on past projects, I'm always looking for ways to improve both professionally and personally.
              </p>
            </div>
          </div>

          <!-- Future Vision -->
          <div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 md:mb-8">Future Vision</h2>
            <div class="space-y-4 md:space-y-6 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                Looking ahead, I aspire to become a software architect who can bridge the gap between technical
                excellence and business value. I want to build systems that not only solve complex problems but also
                make a positive impact on people's lives.
              </p>
              <p>
                My long-term goals include mentoring the next generation of developers, contributing to meaningful
                open-source projects, and perhaps starting my own technology company focused on solving real-world
                problems through innovative software solutions.
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
