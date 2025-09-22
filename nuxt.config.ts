// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@nuxt/ui"],

  nitro: {
    esbuild: {
      options: {
        target: "esnext"
      }
    }
  },
  css: ["/assets/css/main.css"],
  app: {
    head: {
      title: "Regee Casaña - Software Engineer | Full Stack Developer",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Full Stack Developer | Software Engineer specializing in modern web technologies, AI applications, and desktop development.",
        },
      ],
      link: [],
    },
  },
  typescript: {
    strict: true,
  },
  ui: {
    theme: {
      colors: ["primary", "secondary", "tertiary", "info", "success", "warning", "error"],
    },
  },
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  icon: {
    cssLayer: "icon",
  },
});
