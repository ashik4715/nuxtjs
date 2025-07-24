export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
      ],
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.28.0/feather.min.js",
          integrity:
            "sha512-7x3zila4t2qNycrtZ31HO0NnJr8kg2VI67YLoRSyi9hGhRN66FHYWr7Axa9Y1J9tGYHVBPqIjSE1ogHrJTz51g==",
          crossorigin: "anonymous",
          referrerpolicy: "no-referrer",
        },
        {
          hid: "feather-icons",
          innerHTML: `
            // Wait for Feather Icons to load
            window.addEventListener('load', () => {
              feather.replace();
            });
          `,
        },
      ],
    },
  },
  experimental: {
    payloadExtraction: false,
  },
  components: true,
  ssr: true,
  nitro: {
    preset: "vercel",
    // Add explicit API routes for Vercel
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  },
  css: ["@/assets/css/tailwind.css"],
  devtools: { enabled: true },
  image: { dir: "static/img" },
  static: {
    prefix: true,
    dir: "static/img",
  },
});

