<script setup lang="ts">
const colorMode = useColorMode();

const navItems = [
  { name: "Home", href: "#home", icon: "i-lucide-home" },
  { name: "About", href: "#about", icon: "i-lucide-user" },
  { name: "Experience", href: "#timeline", icon: "i-lucide-graduation-cap" },
  { name: "Skills", href: "#skills", icon: "i-lucide-code" },
  { name: "Projects", href: "#projects", icon: "i-lucide-briefcase" },
  { name: "Contact", href: "#contact", icon: "i-lucide-mail" },
];

const activeSection = ref("home");

const currentLogo = computed(() => {
  return `/icons/logo-${colorMode.value}.png`;
});

const handleNavClick = (href: string) => {
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
    activeSection.value = href.replace("#", "");
  }
};
</script>

<template>
  <aside
    class="sidebar fixed left-0 top-0 h-full w-64 bg-background border-r border-border p-6 flex flex-col overflow-y-auto"
  >
    <!-- Profile Section -->
    <div class="flex flex-col items-center mb-8">
      <div class="w-20 h-20 rounded-full flex items-center justify-center mb-4">
        <NuxtImg :src="currentLogo" class="rounded-full" />
      </div>
      <h1 class="text-xl font-bold mb-1">Regee Casaña</h1>
      <p class="text-sm text-muted-foreground">Full Stack Developer</p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1">
      <ul class="space-y-2">
        <li v-for="item in navItems" :key="item.name">
          <button
            @click="handleNavClick(item.href)"
            class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            :class="{ 'bg-accent text-accent-foreground': activeSection === item.name.toLowerCase() }"
          >
            <UIcon :name="item.icon" class="w-4 h-4" />
            {{ item.name }}
          </button>
        </li>
      </ul>
    </nav>

    <!-- Theme Switcher -->
    <div class="mt-auto pt-4 border-t border-border">
      <div class="flex items-center justify-between mb-4">
        <span class="text-sm font-medium">Theme</span>
        <ThemeButton />
      </div>
    </div>

    <!-- Social Links -->
    <div class="flex justify-center gap-4 mt-4">
      <UButton variant="ghost" size="sm" icon="i-lucide-github" to="https://github.com" target="_blank" />
      <UButton variant="ghost" size="sm" icon="i-lucide-linkedin" to="https://linkedin.com" target="_blank" />
      <UButton variant="ghost" size="sm" icon="i-lucide-mail" to="mailto:contact@example.com" />
    </div>
  </aside>
</template>
