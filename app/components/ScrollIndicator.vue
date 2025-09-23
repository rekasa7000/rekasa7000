<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isVisible = ref(true);

const handleScroll = () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  isVisible.value = scrollPosition < windowHeight * 0.5;
};

const scrollToNextSection = () => {
  const experienceSection = document.getElementById("experience");
  if (experienceSection) {
    experienceSection.scrollIntoView({ behavior: "smooth" });
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div v-show="isVisible" class="fixed right-8 bottom-8 z-40 cursor-pointer" @click="scrollToNextSection">
    <div class="flex items-center space-x-3 text-gray-500 hover:text-black transition-colors">
      <span class="text-sm font-mono">scroll</span>
      <svg class="w-5 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 5v14m7-7l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>
