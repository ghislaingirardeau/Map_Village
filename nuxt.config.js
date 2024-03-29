import colors from 'vuetify/es5/util/colors'
require('dotenv').config()

export default {
  ssr: false,

  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'GG DevWeb Map',
    title: 'GG DevWeb Map',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'Locate, track your self or just add a random location on the map. Customize the map, by adding your own datas. 6000 icons available and type your comments. Authentify, import & export your markers to save your work and save or print it later',
      },
      { name: 'format-detection', content: 'telephone=no' },
      {
        name: 'google-site-verification',
        content: process.env.GOOGLETAG,
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.PNG' },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
        integrity: process.env.LEAFLETCSS,
        crossorigin: '',
      },
      { rel: 'stylesheet', href: 'measure/leaflet-measure-path.css' },
    ],
    script: [
      {
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9372873370000772',
        crossorigin: 'anonymous',
      },
      {
        src: 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
        integrity: process.env.LEAFLET,
        crossorigin: '',
      },
      { src: 'measure/leaflet-measure-path.js' }, //https://github.com/ProminentEdge/leaflet-measure-path
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js' },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/Observer.min.js',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/MotionPathPlugin.min.js',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/TextPlugin.min.js',
      },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/Flip.min.js' },
    ],
  },

  css: ['@/assets/home.scss', '@/assets/modal.scss'],

  plugins: ['~/plugins/togeojson'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    '@/components',
    { path: '@/components/leaflet', extensions: ['vue'] },
    { path: '@/components/external', extensions: ['vue'] },
    { path: '@/components/menu', extensions: ['vue'] },
    { path: '@/components/svg', extensions: ['vue'] },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    /* '@nuxtjs/eslint-module', */
    '@nuxtjs/vuetify',
    /* '@nuxt/content', */
    '@nuxtjs/dotenv',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    [
      '@nuxtjs/firebase',
      {
        config: {
          apiKey: process.env.APIKEY,
          authDomain: process.env.AUTHDOMAIN,
          projectId: process.env.PROJECTID,
          appId: process.env.APPID,
          storageBucket: process.env.STORAGEBUCKET,
          messagingSenderId: process.env.MESSAGINGSENDERID,
          measurementId: process.env.MEASUREMENTID,
          databaseURL: process.env.DATABASEURL,
        },
        services: {
          auth: true,
          firestore: true,
          database: true,
          analytics: true,
        },
        analytics: {
          collectionEnabled: true, // default
        },
        auth: {
          persistence: 'local', // keep auth on reload & close browser
          /* initialize: {
            onAuthStateChangedMutation: 'ON_AUTH_STATE_CHANGED_MUTATION',
            onAuthStateChangedAction: 'onAuthStateChangedAction',
            subscribeManually: false
          }, */
        },
      },
    ],
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  sitemap: {
    hostname: 'http://map-tool-village.netlify.app/',
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true, // add to change the variable
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#1e97f3',
          accent: colors.grey.darken3,
          secondary: '#d6d306',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          third: '#f7a24d',
        },
      },
    },
  },

  build: {},

  pwa: {
    meta: {
      title: 'Cartography Map',
      author: 'gg web dev',
    },
    manifest: {
      name: 'Cartography App',
      short_name: 'Cartography App',
      lang: 'en',
      description: 'Cartography web app',
      theme_color: '#30bdc7',
    },
    icon: {
      fileName: 'android-chrome-192x192.png',
      sizes: [64, 120, 144, 152, 192], //, 384, 512
    },
  },
}
