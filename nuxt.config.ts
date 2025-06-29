// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  modules: ["@nuxt/eslint", "@nuxt/fonts", "@nuxt/icon", "@nuxt/image", "@nuxt/ui"],
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
            "Full Stack Developer | Software Engineerspecializing in modern web technologies, AI applications, and desktop development.",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
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
});
