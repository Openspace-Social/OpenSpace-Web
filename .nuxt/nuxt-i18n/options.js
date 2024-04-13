export const Constants = {
  COMPONENT_OPTIONS_KEY: "nuxtI18n",
  STRATEGIES: {"PREFIX":"prefix","PREFIX_EXCEPT_DEFAULT":"prefix_except_default","PREFIX_AND_DEFAULT":"prefix_and_default","NO_PREFIX":"no_prefix"},
}
export const nuxtOptions = {
  isUniversalMode: false,
  trailingSlash: undefined,
}
export const options = {
  vueI18n: {},
  vueI18nLoader: false,
  locales: [{"code":"en","iso":"en-US","file":"en.js","name":"English"},{"code":"es","iso":"es-ES","file":"es.js","name":"Spanish"}],
  defaultLocale: "en",
  defaultDirection: "ltr",
  routesNameSeparator: "___",
  defaultLocaleRouteNameSuffix: "default",
  sortRoutes: true,
  strategy: "no_prefix",
  lazy: true,
  langDir: "/Users/karthikponnam/Desktop/code/massimo/OpenSpace-Web/static/i18n",
  rootRedirect: null,
  detectBrowserLanguage: {"alwaysRedirect":false,"cookieCrossOrigin":false,"cookieDomain":null,"cookieKey":"i18n","cookieSecure":false,"fallbackLocale":"en","onlyOnNoPrefix":false,"onlyOnRoot":false,"useCookie":true},
  differentDomains: false,
  seo: false,
  baseUrl: "https://web.openspace.social",
  vuex: {"moduleName":"i18n","syncLocale":false,"syncMessages":false,"syncRouteParams":true},
  parsePages: true,
  pages: {},
  skipSettingLocaleOnNavigate: false,
  beforeLanguageSwitch: () => null,
  onBeforeLanguageSwitch: () => {},
  onLanguageSwitched: () => null,
  normalizedLocales: [{"code":"en","iso":"en-US","file":"en.js","name":"English"},{"code":"es","iso":"es-ES","file":"es.js","name":"Spanish"}],
  localeCodes: ["en","es"],
}

export const localeMessages = {
  'en.js': () => import('../../static/i18n/en.js' /* webpackChunkName: "lang-en.js" */),
  'es.js': () => import('../../static/i18n/es.js' /* webpackChunkName: "lang-es.js" */),
}
