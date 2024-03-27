export default {
  modules: ["@nuxtjs/tailwindcss"],
  experimental: {
    payloadExtraction: false,
  },
  components: true,
  ssr: true,
  nitro: {
    preset: "vercel-edge",
  },
  css: ["@/assets/css/tailwind.css"],
  devtools: { enabled: true },
  image: { dir: "static/img" },
  static: {
    prefix: true,
    dir: "static/img",
  },
};
