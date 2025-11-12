// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/test-utils", "nuxt-svgo"],
  routeRules: {
    "/api/*": { cache: { maxAge: 3600 } },
  },
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        target: "es2022",
      },
    },
  },
});
