// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  image: {
    domains: ['api.goldenagestravel.com'],
    quality: 80,
    format: ['webp', 'avif'],
    screens: {
      xs: 400,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    }
  },

  routeRules: {
    // Disabled prerender to always fetch fresh data from API
    // '/': { prerender: true }
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    },
    '/_ipx/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    },
    '/images/**': {
      headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' }
    },
    '/fonts/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' }
    }
  },

  compatibilityDate: '2025-01-15',

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json', flag: '🇬🇧' },
      { code: 'ru', name: 'Русский', file: 'ru.json', flag: '🇷🇺' },
      { code: 'uz', name: "O'zbek", file: 'uz.json', flag: '🇺🇿' },
      { code: 'es', name: 'Español', file: 'es.json', flag: '🇪🇸' },
      { code: 'de', name: 'Deutsch', file: 'de.json', flag: '🇩🇪' },
      { code: 'fr', name: 'Français', file: 'fr.json', flag: '🇫🇷' },
      { code: 'it', name: 'Italiano', file: 'it.json', flag: '🇮🇹' }
    ],
    defaultLocale: 'en',
    langDir: '../app/locales',
    strategy: 'prefix_and_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  imports: {
    presets: [
      {
        from: 'vue-i18n',
        imports: ['useI18n'],
      },
    ],
  },
  app: {
    head: {
      title: 'Golden Ages of Uzbekistan | Tours & Travel Packages',
      htmlAttrs: {
        lang: 'en'
      },
      'link': [
        {
          rel: 'icon',
          href: '/favicon.svg'
        }
      ],
      'meta': [
        {
          charset: 'utf-8'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          name: 'description',
          content: 'Explore Uzbekistan with Golden Ages: curated tours, city guides, hotels, and cultural experiences for international travelers.'
        },
        {
          name: 'keywords',
          content: 'Golden Ages of Uzbekistan, Uzbekistan, history of Uzbekistan, travel to Uzbekistan, Uzbekistan travel, Uzbekistan tours, Uzbekistan travel packages, Uzbekistan travel agency, Uzbekistan travel agency in uzbekistan, Uzbekistan travel agency in tashkent, Uzbekistan travel agency in samarkand, Uzbekistan travel agency in khiva, Uzbekistan travel agency in bukhara'
        },
        {
          name: 'facebook-domain-verification',
          content: '7duk0fno85nl9nbxfn7j17fxeurvet'
        }
      ],
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=AW-17928071140',
          async: true
        },
        {
          innerHTML: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','AW-17928071140');"
        }
      ],
      noscript: [
        {
          innerHTML: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1607287043845190&ev=PageView&noscript=1">'
        }
      ]
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: import.meta.env.NUXT_PUBLIC_SITE_URL || 'https://goldenagestravel.com'
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
