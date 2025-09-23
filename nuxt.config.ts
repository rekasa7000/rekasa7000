import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxt/content", "@nuxt/eslint", "@nuxt/image", "@nuxt/scripts", "@nuxt/test-utils", "@nuxt/ui"],
  vite: { plugins: [tailwindcss()] },
});
