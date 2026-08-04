export default defineNuxtConfig({
  compatibilityDate: '2026-08-03',
  modules: ['@nuxtjs/tailwindcss', '@vercel/speed-insights'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
      ],
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.28.0/feather.min.js',
          integrity:
            'sha512-7x3zila4t2qNycrtZ31HO0NnJr8kg2VI67YLoRSyi9hGhRN66FHYWr7Axa9Y1J9tGYHVBPqIjSE1ogHrJTz51g==',
          crossorigin: 'anonymous',
          referrerpolicy: 'no-referrer',
        },
        {
          hid: 'feather-icons',
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
    preset: 'vercel-edge',
  },
  css: ['@/assets/css/tailwind.css'],
  devtools: { enabled: true },
  runtimeConfig: {
    openaiApiKey: process.env.OPENCODE_API_KEY || process.env.NUXT_OPENAI_API_KEY,
    public: {
      difyApiUrl: process.env.DIFY_API_URL || 'https://api.dify.ai/v1',
      difyApiKey: process.env.DIFY_API_KEY || '',
    },
  },
});
