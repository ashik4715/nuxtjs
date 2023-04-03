export default {
  modules: ["@nuxtjs/tailwindcss"],
  components: true,
  ssr: true,
  nitro: {
    preset: "vercel-edge",
  },
  css: ["@/assets/css/tailwind.css"],
  image: { dir: "static/img" },
  static: {
    prefix: true,
    dir: "static/img",
  },
};
