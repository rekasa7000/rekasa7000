<script setup lang="ts">
import { useFavicon } from "./composables/useFavicon";
import type { TimelineItem } from "@nuxt/ui";

useSeoMeta({
  title: "Regee Casaña - Portfolio",
  description: "Full Stack Developer specializing in modern web technologies",
});

useFavicon();

const timelineItems = ref<TimelineItem[]>([
  {
    title: "Science and Technology, Engineering and Mathematics (STEM)",
    description: "Graduated with High Honors - Microcity College of Business and Technology. ",
    icon: "i-lucide-graduation-cap",
    date: "2018 - 2020",
  },
  {
    title: "Bachelor of Science in Computer Science",
    description:
      "Graduated Cum Laude - Bataan Peninsula State University. Graduated with latin honor, specializing in software engineering, algorithms, and system design. Developed strong foundation in programming languages, database management, and software development methodologies.",
    icon: "i-lucide-graduation-cap",
    date: "2020 - 2024",
  },
  {
    title: "Software Engineering Intern",
    description:
      "Work as an intern in a tech startup company - Kloudtech Corp. Learned about IoT, applied cybersecurity, enhanced and maintained company's web app, and optimized the codebase.",
    icon: "i-lucide-code",
    date: "2023 - 2024",
  },
  {
    title: "Software Engineer",
    description:
      "Lead Software Engineer - Kloudtech Corp. Absorbed by the company and lead a team of three developers. Architected and developed a comprehensive weather monitoring system with real-time data collection, IoT integration, and web dashboard for clients",
    icon: "i-lucide-cloud-rain",
    date: "2024 - present",
  },
]);
</script>

<template>
  <NuxtLayout class="p-0">
    <section id="home" class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-4xl mx-auto">
        <h1
          class="text-6xl font-bold mb-6 py-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Software Engineer
        </h1>
        <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A computer science graduate with latin honor. Software builder, galaxy thinker, and matcha drinker. Currently
          working on innovative solutions in weather monitoring systems, time tracking applications, and AI-powered
          tools.
        </p>
        <div class="flex gap-4 justify-center">
          <UButton size="lg" to="#projects"> View My Work </UButton>
          <UButton size="lg" variant="outline" to="#contact"> Get In Touch </UButton>
        </div>
      </div>
    </section>

    <section id="about" class="py-20 bg-muted/50">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold mb-12 text-center">About Me</h2>
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p class="text-lg text-muted-foreground mb-6">
              I'm a passionate full-stack developer with expertise in modern web technologies including React, Vue,
              Node.js, and cloud platforms. I love building scalable applications that solve real-world problems and
              create exceptional user experiences.
            </p>
            <p class="text-lg text-muted-foreground mb-6">
              From weather monitoring systems to AI-powered tools, I bring a holistic approach to every project, working
              with technologies like TypeScript, Python, Go, Rust, and various databases to ensure seamless integration
              and optimal performance.
            </p>
            <UButton to="#contact" class="mt-4"> Let's Work Together </UButton>
          </div>
          <div class="flex justify-center">
            <NuxtImg src="/images/regee.png" class="object-cover size-[720px]" />
          </div>
        </div>
      </div>
    </section>

    <section id="timeline" class="py-20">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold mb-12 text-center">Professional & Academic Journey</h2>
        <UTimeline :items="timelineItems" class="w-full h-[50vh]" size="3xl" />
      </div>
    </section>

    <section id="skills" class="py-20 bg-muted/50">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold mb-12 text-center">Skills & Technologies</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-monitor" class="w-6 h-6" />
                <h3 class="text-lg font-semibold">Frontend</h3>
              </div>
            </template>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="success" variant="outline">Vue.js</UBadge>
                <UBadge size="lg" color="success" variant="outline">Nuxt.js</UBadge>
                <UBadge size="lg" color="info" variant="outline">React</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="primary" variant="outline">TypeScript</UBadge>
                <UBadge size="lg" color="secondary" variant="outline">Tailwind CSS</UBadge>
                <UBadge size="lg" color="info" variant="outline">Next.js</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="primary" variant="outline">TanStack</UBadge>
                <UBadge size="lg" color="warning" variant="outline">Vite</UBadge>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-server" class="w-6 h-6" />
                <h3 class="text-lg font-semibold">Backend</h3>
              </div>
            </template>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="success" variant="outline">Node.js</UBadge>
                <UBadge size="lg" color="secondary" variant="outline">Express</UBadge>
                <UBadge size="lg" color="warning" variant="outline">Python</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="info" variant="outline">PostgreSQL</UBadge>
                <UBadge size="lg" color="success" variant="outline">MongoDB</UBadge>
                <UBadge size="lg" color="primary" variant="outline">MySQL</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="primary" variant="outline">Prisma</UBadge>
                <UBadge size="lg" color="error" variant="outline">Flask</UBadge>
                <UBadge size="lg" color="info" variant="outline">Golang</UBadge>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-wrench" class="w-6 h-6" />
                <h3 class="text-lg font-semibold">Tools & DevOps</h3>
              </div>
            </template>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="warning" variant="outline">AWS EC2</UBadge>
                <UBadge size="lg" color="warning" variant="outline">AWS IoT Core</UBadge>
                <UBadge size="lg" color="warning" variant="outline">AWS S3</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="error" variant="outline">Git</UBadge>
                <UBadge size="lg" color="info" variant="outline">Docker</UBadge>
                <UBadge size="lg" color="secondary" variant="outline">Github</UBadge>
                <UBadge size="lg" color="success" variant="outline">GitHub Actions</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="primary" variant="outline">Vercel</UBadge>
                <UBadge size="lg" color="primary" variant="outline">Hostinger VPS</UBadge>
                <UBadge size="lg" color="warning" variant="outline">Firebase</UBadge>
              </div>
            </div>
          </UCard>
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-folder-code" class="w-6 h-6" />
                <h3 class="text-lg font-semibold">Software & Game Development</h3>
              </div>
            </template>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="primary" variant="outline">C#</UBadge>
                <UBadge size="lg" color="secondary" variant="outline">C/C++</UBadge>
                <UBadge size="lg" color="info" variant="outline">.NET</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="warning" variant="outline">Java</UBadge>
                <UBadge size="lg" color="error" variant="outline">Rust</UBadge>
                <UBadge size="lg" color="primary" variant="outline">Unity</UBadge>
              </div>
            </div>
          </UCard>
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-monitor-cog" class="w-6 h-6" />
                <h3 class="text-lg font-semibold">Operating Systems</h3>
              </div>
            </template>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="info" variant="outline">Windows</UBadge>
                <UBadge size="lg" color="secondary" variant="outline">MacOS</UBadge>
                <UBadge size="lg" color="warning" variant="outline">Ubuntu</UBadge>
              </div>
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="primary" variant="outline">Fedora OS</UBadge>
                <UBadge size="lg" color="primary" variant="outline">Pop_OS!</UBadge>
              </div>
            </div>
          </UCard>
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-component" class="w-6 h-6" />
                <h3 class="text-lg font-semibold">Design & Prototyping</h3>
              </div>
            </template>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <UBadge size="lg" color="primary" variant="outline">Figma</UBadge>
                <UBadge size="lg" color="secondary" variant="outline">Canva</UBadge>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <section id="projects" class="py-20">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <UCard>
            <template #header>
              <div
                class="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center"
              >
                <UIcon name="i-lucide-cloud-rain" class="w-12 h-12 text-primary" />
              </div>
            </template>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">KloudTrack Weather System</h3>
              <p class="text-muted-foreground mb-4">
                A comprehensive weather monitoring system with real-time data collection from hardware stations and web
                dashboard for government officials and citizens.
              </p>
              <div class="flex gap-2 mb-4">
                <UBadge size="sm" color="secondary">React</UBadge>
                <UBadge size="sm" color="primary">TypeScript</UBadge>
                <UBadge size="sm" color="warning">Node.js</UBadge>
                <UBadge size="sm" color="info">PostgreSQL</UBadge>
              </div>
              <div class="flex gap-2">
                <UButton size="sm" variant="outline">
                  <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-1" />
                  Demo
                </UButton>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div
                class="aspect-video bg-gradient-to-br from-primary-500/20 to-tertiary-500/20 rounded-t-lg flex items-center justify-center"
              >
                <UIcon name="i-lucide-brain" class="w-12 h-12 text-primary-600" />
              </div>
            </template>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">HananAI</h3>
              <p class="text-muted-foreground mb-4">
                AI agent inspired by Hanan, the Tagalog goddess of morning. An intelligent assistant built with modern
                AI technologies.
              </p>
              <div class="flex gap-2 mb-4">
                <UBadge size="sm" color="primary">Python</UBadge>
                <UBadge size="sm" color="secondary">Google Gemini</UBadge>
                <UBadge size="sm" color="info">AI/ML</UBadge>
              </div>
              <div class="flex gap-2">
                <UButton size="sm" variant="outline">
                  <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-1" />
                  Demo
                </UButton>
                <UButton size="sm" variant="ghost">
                  <UIcon name="i-lucide-github" class="w-4 h-4 mr-1" />
                  Code
                </UButton>
              </div>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <div
                class="aspect-video bg-gradient-to-br from-secondary-500/20 to-teal-500/20 rounded-t-lg flex items-center justify-center"
              >
                <UIcon name="i-lucide-briefcase" class="w-12 h-12 text-secondary-600" />
              </div>
            </template>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">Jobowl</h3>
              <p class="text-muted-foreground mb-4">
                Desktop job application tracker with intuitive GUI for tracking applications, managing statuses, and
                monitoring job search progress. Built for GNOME desktop.
              </p>
              <div class="flex gap-2 mb-4">
                <UBadge size="sm" color="secondary">Rust</UBadge>
                <UBadge size="sm" color="success">GTK4</UBadge>
                <UBadge size="sm" color="error">Desktop</UBadge>
              </div>
              <div class="flex gap-2">
                <UButton size="sm" variant="outline">
                  <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-1" />
                  Demo
                </UButton>
                <UButton size="sm" variant="ghost">
                  <UIcon name="i-lucide-github" class="w-4 h-4 mr-1" />
                  Code
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </section>

    <section id="contact" class="py-20 bg-muted/50">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold mb-6">Let's Work Together</h2>
        <p class="text-xl text-muted-foreground mb-12">
          Have a project in mind? I'd love to hear about it and discuss how we can bring your ideas to life.
        </p>

        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UIcon name="i-lucide-mail" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">Email</h3>
            <p class="text-muted-foreground">regeecasana57@gmail.com</p>
          </div>

          <div class="flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UIcon name="i-lucide-linkedin" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">LinkedIn</h3>
            <p class="text-muted-foreground">linkedin.com/in/rekasa</p>
          </div>

          <div class="flex flex-col items-center">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <UIcon name="i-lucide-github" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="font-semibold mb-2">GitHub</h3>
            <p class="text-muted-foreground">github.com/rekasa7000</p>
          </div>
        </div>

        <UButton size="lg" to="mailto:regeecasana57@gmail.com">
          <UIcon name="i-lucide-send" class="w-5 h-5 mr-2" />
          Send Message
        </UButton>
      </div>
    </section>
  </NuxtLayout>
</template>
