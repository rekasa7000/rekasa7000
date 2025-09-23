<script setup lang="ts">
useSeoMeta({
  title: "Regee Casaña",
  description: "Software Engineer",
});

const projects = [
  {
    title: "KloudTrack Weather System",
    description:
      "A comprehensive weather monitoring system with real-time data collection from hardware stations and web dashboard for government officials and citizens.",
    githubUrl: "https://github.com/rekasa7000/kloudtrack",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    year: "2024",
  },
  {
    title: "Logcha",
    description: "A simple and modern time tracking app for interns and OJTs, built with Go and React.",
    githubUrl: "https://github.com/rekasa7000/logcha",
    technologies: ["React", "Typescript", "Tanstack", "Golang", "Fiber"],
    year: "2024",
  },
  {
    title: "Jobowl",
    description:
      "Desktop job application tracker with intuitive GUI for tracking applications, managing statuses, and monitoring job search progress. Built for GNOME desktop.",
    githubUrl: "https://github.com/rekasa7000/jobowl",
    technologies: ["Rust", "GTK4", "Desktop"],
    year: "2024",
  },
  {
    title: "Databox",
    description:
      "A student scheduler and progress tracker that runs in the background for real-time notification and alerts. Developed using C#, .NET, MySQL, and Apache Server",
    githubUrl: "https://github.com/rekasa7000/databox",
    technologies: ["C#", ".NET", "MySQL", "Apache"],
    year: "2023",
  },
  {
    title: "HananAI",
    description: "AI agent inspired by Hanan, the Tagalog goddess of morning, for your breakfast.",
    githubUrl: "https://github.com/rekasa7000/hananai",
    technologies: ["Python", "AI/ML", "Google Gemini"],
    year: "2024",
  },
  {
    title: "Knowt",
    description:
      "Advanced article summarization tool with AI-powered sentiment analysis, built using Python Flask and Firebase for secure content processing and management.",
    githubUrl: "https://github.com/rekasa7000/knowt",
    technologies: ["Python", "Flask", "Firebase", "HTML/CSS"],
    year: "2023",
  },
];

const navigateToGitHub = (url: string) => {
  window.open(url, "_blank");
};

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Express", "Flask", "FastAPI", "Gin"] },
  { category: "Database", items: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Firebase"] },
  { category: "Languages", items: ["Javascript", "Typescript", "Go", "Python", "PHP", "C#", "Rust", "C/C++", "Java"] },
  { category: "Tools", items: ["Git", "GitHub", "Postman", "VS Code", "Unity"] },
  { category: "Cloud & DevOps", items: ["AWS", "Vercel", "Heroku", "Docker", "Hostinger VPS", "DigitalOcean"] },
  { category: "Design", items: ["Figma", "Canva"] },
];
</script>

<template>
  <div class="min-h-screen bg-white text-black font-mono">
    <ScrollIndicator />
    <header class="z-50 w-full hidden md:block">
      <div class="w-full px-6 py-6">
        <div class="flex items-center justify-center gap-4 text-sm font-bold w-full">
          <div class="w-[720px] text-center">Full-stack Developer</div>
          <div class="h-[0.07rem] w-full bg-gray-300"></div>
          <div class="w-[720px] text-center">Software Engineer</div>
          <div class="h-[0.07rem] w-full bg-gray-300"></div>
          <div class="w-[720px] text-center">Technical/Software Architect</div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6">
      <!-- Hero Section -->
      <section class="py-20 md:pt-20 md:pb-40 border-b border-gray-200">
        <div class="w-full">
          <h1 class="text-4xl md:text-[10.25rem] font-bold mb-8 leading-tight">Regee Casaña</h1>
          <h2 class="text-2xl md:text-5xl font-bold mb-8 leading-tight">
            Software Engineer specializing in modern web technologies and scalable applications.
          </h2>
          <div class="text-lg text-gray-600 space-y-4">
            <p>
              Computer science graduate with latin honor. Currently working as Lead Software Engineer at Kloudtech Corp.
            </p>
            <p>
              I build weather monitoring systems, time tracking applications, and AI-powered tools that solve real-world
              problems.
            </p>
          </div>
        </div>

        <div class="flex gap-4 mt-8">
          <a href="/about-me" class="text-sm border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors">
            About Me
          </a>
          <a
            href="/about-portfolio"
            class="text-sm border border-gray-300 px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            About Portfolio
          </a>
        </div>
      </section>

      <!-- Experience Section -->
      <section class="py-20 border-b border-gray-200" id="experience">
        <h2 class="text-2xl font-bold mb-12">Experience</h2>
        <div class="grid gap-8">
          <div class="grid md:grid-cols-12 gap-8">
            <div class="md:col-span-3">
              <div class="text-sm text-gray-500">2024 - Present</div>
            </div>
            <div class="md:col-span-9">
              <h3 class="font-semibold mb-2">Software Engineer</h3>
              <div class="text-gray-600 mb-2">Kloudtech Corp</div>
              <p class="text-sm text-gray-600">
                Lead Software Engineer leading a team of three developers. Architected and developed a comprehensive
                weather monitoring system with real-time data collection, IoT integration, and web dashboard for
                clients.
              </p>
            </div>
          </div>

          <div class="grid md:grid-cols-12 gap-8">
            <div class="md:col-span-3">
              <div class="text-sm text-gray-500">2023 - 2024</div>
            </div>
            <div class="md:col-span-9">
              <h3 class="font-semibold mb-2">Software Engineering Intern</h3>
              <div class="text-gray-600 mb-2">Kloudtech Corp</div>
              <p class="text-sm text-gray-600">
                Learned about IoT, applied cybersecurity, enhanced and maintained company's web app, and optimized the
                codebase.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Education Section -->
      <section class="py-20 border-b border-gray-200" id="education">
        <h2 class="text-2xl font-bold mb-12">Education</h2>
        <div class="grid gap-8">
          <div class="grid md:grid-cols-12 gap-8">
            <div class="md:col-span-3">
              <div class="text-sm text-gray-500">2020 - 2024</div>
            </div>
            <div class="md:col-span-9">
              <h3 class="font-semibold mb-2">Bachelor of Science in Computer Science</h3>
              <div class="text-gray-600 mb-2">Bataan Peninsula State University</div>
              <p class="text-sm text-gray-600">
                Graduated Cum Laude with latin honor, specializing in software engineering, algorithms, and system
                design. Developed strong foundation in programming languages, database management, and software
                development methodologies.
              </p>
            </div>
          </div>

          <div class="grid md:grid-cols-12 gap-8">
            <div class="md:col-span-3">
              <div class="text-sm text-gray-500">2018 - 2020</div>
            </div>
            <div class="md:col-span-9">
              <h3 class="font-semibold mb-2">Science, Technology, Engineering and Mathematics (STEM)</h3>
              <div class="text-gray-600 mb-2">Microcity College of Business and Technology</div>
              <p class="text-sm text-gray-600">
                Graduated with Honor. Focused on mathematics, science, and technology fundamentals that provided a
                strong foundation for computer science studies.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section id="skills" class="py-20 border-b border-gray-200">
        <h2 class="text-2xl font-bold mb-12">Skills & Technologies</h2>

        <!-- Tech Icons Grid - Minimalist Style -->
        <div class="mb-16">
          <div class="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6">
            <!-- Frontend Technologies -->
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=nextjs"
                alt="Next.js"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=react"
                alt="React"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=vue"
                alt="Vue.js"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=nuxtjs"
                alt="Nuxt.js"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=angular"
                alt="Angular"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=svelte"
                alt="Svelte"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <!-- Languages -->
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=ts"
                alt="TypeScript"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=js"
                alt="JavaScript"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=python"
                alt="Python"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=go"
                alt="Go"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=php"
                alt="PHP"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=rust"
                alt="Rust"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <!-- Backend & Frameworks -->
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=nodejs"
                alt="Node.js"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=express"
                alt="Express"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=flask"
                alt="Flask"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=fastapi"
                alt="FastAPI"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <!-- Databases -->
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=postgresql"
                alt="PostgreSQL"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=mongodb"
                alt="MongoDB"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=mysql"
                alt="MySQL"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=firebase"
                alt="Firebase"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=supabase"
                alt="Supabase"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <!-- Desktop Development -->
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=cs"
                alt="C#"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=cpp"
                alt="C++"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=java"
                alt="Java"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <!-- Cloud & DevOps -->
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=aws"
                alt="AWS"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=vercel"
                alt="Vercel"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=heroku"
                alt="Heroku"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=docker"
                alt="Docker"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <!-- Styling -->
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=tailwind"
                alt="Tailwind CSS"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>

            <!-- Tools -->
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=unity"
                alt="Unity"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=git"
                alt="Git"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=github"
                alt="GitHub"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=postman"
                alt="Postman"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=vscode"
                alt="VS Code"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
            <div class="flex justify-center">
              <img
                src="https://skillicons.dev/icons?i=figma"
                alt="Figma"
                class="w-8 h-8 grayscale hover:grayscale-0 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Skills Categories - Grid Layout -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="skill in skills" :key="skill.category" class="space-y-3">
            <h3 class="font-semibold text-sm uppercase tracking-wider text-gray-500">{{ skill.category }}</h3>
            <div class="space-y-1">
              <div v-for="item in skill.items" :key="item" class="text-sm">{{ item }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Works Section -->
      <section id="works" class="py-20 border-b border-gray-200">
        <h2 class="text-2xl font-bold mb-12">Selected Works</h2>
        <div class="grid gap-12">
          <div
            v-for="(project, index) in projects"
            :key="index"
            class="group cursor-pointer"
            @click="navigateToGitHub(project.githubUrl)"
          >
            <div class="grid md:grid-cols-12 gap-8 items-start">
              <div class="md:col-span-3">
                <div class="text-sm text-gray-500 mb-2">{{ project.year }}</div>
                <h3 class="text-xl font-semibold group-hover:underline">{{ project.title }}</h3>
              </div>
              <div class="md:col-span-6">
                <p class="text-gray-600 mb-4">{{ project.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tech in project.technologies" :key="tech" class="text-xs px-2 py-1 bg-gray-100 rounded">
                    {{ tech }}
                  </span>
                </div>
              </div>
              <div class="md:col-span-3 flex justify-end">
                <div class="text-sm text-gray-500 group-hover:text-black transition-colors">View Project →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="py-20">
        <h2 class="text-2xl font-bold mb-12">Contact</h2>
        <div class="grid md:grid-cols-2 gap-12">
          <div class="space-y-6">
            <p class="text-gray-600">
              I'm always interested in discussing new opportunities, collaborations, or just having a conversation about
              technology and software development.
            </p>
            <div class="space-y-2">
              <div class="text-sm">
                <span class="text-gray-500">Email:</span>
                <a href="mailto:regeecasana57@gmail.com" class="ml-2 hover:underline">regeecasana57@gmail.com</a>
              </div>
              <div class="text-sm">
                <span class="text-gray-500">LinkedIn:</span>
                <a href="https://linkedin.com/in/rekasa" target="_blank" class="ml-2 hover:underline"
                  >linkedin.com/in/rekasa</a
                >
              </div>
              <div class="text-sm">
                <span class="text-gray-500">GitHub:</span>
                <a href="https://github.com/rekasa7000" target="_blank" class="ml-2 hover:underline"
                  >github.com/rekasa7000</a
                >
              </div>
              <div class="text-sm">
                <span class="text-gray-500">Twitter:</span>
                <a href="https://x.com/regeewashere" target="_blank" class="ml-2 hover:underline">@regeewashere</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 mt-20">
      <div class="max-w-6xl mx-auto px-6 py-8">
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
