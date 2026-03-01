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
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    // Disabled prerender to always fetch fresh data from API
    // '/': { prerender: true }
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
          name: 'title',
          content: 'Golden Ages of Uzbekistan | Tours & Travel Packages'
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
          innerHTML: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1607287043845190');
fbq('track', 'PageView');`
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
