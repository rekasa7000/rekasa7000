<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const colorMode = useColorMode();

const items = ref<DropdownMenuItem[]>([
  {
    label: "Light",
    icon: "i-lucide-sun",
    value: "light",
    onSelect() {
      handleSelect("light");
    },
  },
  {
    label: "Dark",
    icon: "i-lucide-moon",
    value: "dark",
    onSelect() {
      handleSelect("dark");
    },
  },
  {
    label: "Matcha",
    icon: "i-lucide-leaf",
    value: "matcha",
    onSelect() {
      handleSelect("matcha");
    },
  },
  {
    label: "Space",
    icon: "i-lucide-sparkles",
    value: "space",
    onSelect() {
      handleSelect("space");
    },
  },
]);

const currentTheme = computed((): DropdownMenuItem => {
  return items.value.find((item) => item.value === colorMode.value) || items.value[0];
});

const handleSelect = (item: string) => {
  colorMode.preference = item;
};
</script>

<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'start',
        side: 'bottom',
        sideOffset: 8,
      }"
      :ui="{
        content: 'w-48',
      }"
      @select="handleSelect"
    >
      <UButton :icon="currentTheme.icon" color="neutral" variant="outline" class="capitalize">
        {{ currentTheme.value }}
      </UButton>
    </UDropdownMenu>
  </ClientOnly>
</template>
