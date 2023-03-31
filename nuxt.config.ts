export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  components: true,
  nitro: {
    preset: "vercel-edge",
  },
  css: ["@/assets/css/tailwind.css"],
});
