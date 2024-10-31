// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  modules: [
    '@vite-pwa/nuxt',
    '@primevue/nuxt-module',
    '@nuxtjs/tailwindcss',
    '@nuxt/image'
  ],

  pwa: {
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Diamond Clinic',
      short_name: 'DiamonClinic',
      description: 'Diamond Beauty & Anti Aging Clinic',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
    workbox: {
      cleanupOutdatedCaches: true,
      navigateFallback: '/',
    }
  },

  primevue: {
    autoImport: false,
    components: {
        include: ['Accordion', 'AccordionPanel', 'AccordionHeader', 'AccordionContent', 'Button', 'Card', 'Carousel']
    },
    options: {
        ripple: true,
        inputVariant: 'filled',
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: false,
                cssLayer: {
                  name: 'primevue',
                  order: 'tailwind-base, primevue, tailwind-utilities'
                }
            }
        }
    }
  },

  tailwindcss: {
    cssPath: ['assets/css/tailwind.css' , {injectPosition: 'first'}],
    configPath: 'tailwind.config.js',
    exposeConfig: false,
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'
        }
      ]
    }
  },

  compatibilityDate: '2024-10-30',
})