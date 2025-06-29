<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const colorMode = useColorMode();

const items = ref<DropdownMenuItem[]>([
  {
    label: "Dark",
    icon: "i-lucide-moon",
    value: "dark",
  },
  {
    label: "Light",
    icon: "i-lucide-sun",
    value: "light",
  },
  {
    label: "Matcha",
    icon: "i-lucide-leaf",
    value: "matcha",
  },
]);

// Handle dropdown selection - this gets the selected item
const handleSelect = (item: any) => {
  console.log("Selected item:", item); // You can see the full item object here
  colorMode.preference = item.value;
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
        {{ colorMode.value }}
      </UButton>
    </UDropdownMenu>
  </ClientOnly>
</template>
