// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json', flag: '🇬🇧' },
      { code: 'ru', name: 'Русский', file: 'ru.json', flag: '🇷🇺' },
      { code: 'uz', name: "O'zbek", file: 'uz.json', flag: '🇺🇿' },
      { code: 'es', name: 'Español', file: 'es.json', flag: '🇪🇸' },
      { code: 'de', name: 'Deutsch', file: 'de.json', flag: '🇩🇪' },
      { code: 'fr', name: 'Français', file: 'fr.json', flag: '🇫🇷' }
    ],
    defaultLocale: 'en',
    lazy: true,
    langDir: '../app/locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  headers: {
    'link': [
      {
        rel: 'icon',
        href: '/favicon.svg'
      }
    ],
    'meta': [
      {
        name: 'description',
        content: 'Golden Ages of Uzbekistan - Discover the history and heritage of Uzbekistan'
      },
      {
        name: 'keywords',
        content: 'Golden Ages of Uzbekistan, Uzbekistan, history, heritage, tourism, travel, explore, discover, visit, experience, culture, cuisine, art, handicrafts, music, festivals, history, heritage stories, Samarkand, Khiva, Bukhara, Tashkent, Uzbekistan Tours, Uzbekistan Travel, Uzbekistan Vacations, Uzbekistan Packages, Uzbekistan Travel Packages, Uzbekistan Travel Agency, Uzbekistan Travel Agency in Uzbekistan, Uzbekistan Travel Agency in Tashkent, Uzbekistan Travel Agency in Samarkand, Uzbekistan Travel Agency in Khiva, Uzbekistan Travel Agency in Bukhara'
      }
    ],
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
