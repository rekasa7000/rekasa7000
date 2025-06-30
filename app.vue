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
    title: "Science, Technology, Engineering and Mathematics (STEM)",
    description: "Graduated with Honor - Microcity College of Business and Technology. ",
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

const getGitHubThumbnail = (url: string): string => {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (match) {
    const [, owner, repo] = match;
    return `https://opengraph.githubassets.com/1/${owner}/${repo}`;
  }
  return "/images/fallback.png";
};

const navigateToGitHub = (url: string) => {
  window.open(url, "_blank");
};

const projects = [
  {
    title: "KloudTrack Weather System",
    description:
      "A comprehensive weather monitoring system with real-time data collection from hardware stations and web dashboard for government officials and citizens.",
    githubUrl: "https://github.com/rekasa7000/kloudtrack",
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
    colors: ["secondary", "primary", "warning", "info", "primary"],
  },
  {
    title: "Logcha",
    description: "A simple and modern time tracking app for interns and OJTs, built with Go and React.",
    githubUrl: "https://github.com/rekasa7000/logcha",
    technologies: ["React", "Typescript", "Tanstack", "Golang", "Fiber"],
    colors: ["primary", "secondary", "info", "info", "primary"],
    showButtons: true,
  },
  {
    title: "Jobowl",
    description:
      "Desktop job application tracker with intuitive GUI for tracking applications, managing statuses, and monitoring job search progress. Built for GNOME desktop.",
    githubUrl: "https://github.com/rekasa7000/jobowl",
    technologies: ["Rust", "GTK4", "Desktop"],
    colors: ["secondary", "success", "error"],
  },
  {
    title: "Databox",
    description:
      "A student scheduler and progress tracker that runs in the background for real-time notification and alerts. Developed using C#, .NET, MySQL, and Apache Server",
    githubUrl: "https://github.com/rekasa7000/databox",
    technologies: ["C#", ".NET", "MySQL", "Apache"],
    colors: ["primary", "secondary", "info", "info"],
  },
  {
    title: "HananAI",
    description: "AI agent inspired by Hanan, the Tagalog goddess of morning, for your breakfast.",
    githubUrl: "https://github.com/rekasa7000/hananai",
    technologies: ["Python", "AI/ML", "Google Gemini"],
    colors: ["primary", "secondary", "info"],
  },
  {
    title: "Knowt",
    description:
      "Advanced article summarization tool with AI-powered sentiment analysis, built using Python Flask and Firebase for secure content processing and management.",
    githubUrl: "https://github.com/rekasa7000/knowt",
    technologies: ["Python", "Flask", "Firebase", "HTML/CSS"],
    colors: ["primary", "secondary", "info", "info"],
  },
];

type BadgeColor =
  | "secondary"
  | "primary"
  | "warning"
  | "info"
  | "success"
  | "error"
  | "tertiary"
  | "neutral"
  | undefined;

type ColorThemes = "matcha" | "space" | "dark" | "light";

const colorMode = useColorMode();

const getThemeGradient = (theme: ColorThemes) => {
  const gradients = {
    matcha: "from-green-100/20 to-emerald-200/40",
    space: "from-indigo-900/20 to-purple-900/30",
    light: "from-primary/10 to-secondary/20",
    dark: "from-gray-800/20 to-gray-900/30",
  };
  return gradients[theme] || gradients.light;
};

const containerClasses = computed(() => [
  "aspect-video bg-gradient-to-br rounded-t-lg flex items-center justify-center relative overflow-hidden",
  getThemeGradient(colorMode.value as ColorThemes),
]);
console.log(colorMode.value);
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
        <UTimeline :items="timelineItems" class="w-full h-[50vh]" size="3xl" :default-value="3" />
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
          <UCard
            v-for="(project, index) in projects"
            :key="index"
            class="transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            @click="navigateToGitHub(project.githubUrl)"
          >
            <template #header>
              <div
                class="aspect-video rounded-t-lg flex items-center justify-center relative overflow-hidden"
                :class="containerClasses"
              >
                <img
                  src="/images/projects/kloudtrack.png"
                  :alt="`${project.title} repository preview`"
                  class="object-cover w-full h-full"
                  @error="(e) => { (e.target as HTMLImageElement).src = '/images/fallback.png' }"
                  v-if="project.title === 'KloudTrack Weather System'"
                />
                <img
                  src="/images/projects/logcha.png"
                  :alt="`${project.title} repository preview`"
                  class="object-cover w-full h-full"
                  @error="(e) => { (e.target as HTMLImageElement).src = '/images/fallback.png' }"
                  v-else-if="project.title === 'Logcha'"
                />
                <img
                  src="/images/projects/jobowl.png"
                  :alt="`${project.title} repository preview`"
                  class="object-cover w-full h-full"
                  @error="(e) => { (e.target as HTMLImageElement).src = '/images/fallback.png' }"
                  v-else-if="project.title === 'Jobowl'"
                />
                <img
                  :src="getGitHubThumbnail(project.githubUrl)"
                  :alt="`${project.title} repository preview`"
                  class="object-cover w-full h-full"
                  @error="(e) => { (e.target as HTMLImageElement).src = '/images/fallback.png' }"
                  v-else
                />
              </div>
            </template>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2">{{ project.title }}</h3>
              <p class="text-muted-foreground mb-4">{{ project.description }}</p>
              <div class="flex gap-2 mb-4 flex-wrap">
                <UBadge
                  v-for="(tech, techIndex) in project.technologies"
                  :key="techIndex"
                  size="sm"
                  :color="project.colors[techIndex] as BadgeColor"
                >
                  {{ tech }}
                </UBadge>
              </div>
              <div v-if="project.showButtons" class="flex gap-2">
                <UButton size="sm" variant="outline">
                  <UIcon name="i-lucide-code-xml" class="w-4 h-4 mr-1" />
                  Underdevelopment
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
