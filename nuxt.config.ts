export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  components: true,
  ssr: true,
  nitro: {
    preset: "vercel-edge",
  },
  css: ["@/assets/css/tailwind.css"],
});
