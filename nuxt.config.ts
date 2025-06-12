import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  app: {
    head: {
      title: "Ms",
      titleTemplate: "%s - Ms",
    },
  },

  modules: [
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils/module",
    "shadcn-nuxt",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
    "@nuxtjs/color-mode",
  ],

  colorMode: {
    classSuffix: "",
  },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  nitro: {
    routeRules: {
      "/api/**": {
        proxy: {
          to: "https://mansap-server.vercel.app/api/**",
          // to: "http://localhost:3001/api/**",
        },
      },
    },
  },

  i18n: {
    locales: [
      { code: "en", name: "English", language: "en-US", file: "en.json" },
      { code: "ru", name: "Русский", language: "ru-RU", file: "ru.json" },
      { code: "kk", name: "Казахский", language: "kk-KK", file: "kk.json" },
    ],
    defaultLocale: "en",
    strategy: "no_prefix",
  },
});
