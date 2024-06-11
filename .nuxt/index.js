import Vue from 'vue'

import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from './components/nuxt-error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'

/* Plugins */

import nuxt_plugin_pluginrouting_22b8d2b1 from 'nuxt_plugin_pluginrouting_22b8d2b1' // Source: .\\nuxt-i18n\\plugin.routing.js (mode: 'all')
import nuxt_plugin_pluginmain_46db7e5e from 'nuxt_plugin_pluginmain_46db7e5e' // Source: .\\nuxt-i18n\\plugin.main.js (mode: 'all')
import nuxt_plugin_localforage_68916d1d from 'nuxt_plugin_localforage_68916d1d' // Source: .\\localforage.js (mode: 'client')
import nuxt_plugin_axios_8cadaef0 from 'nuxt_plugin_axios_8cadaef0' // Source: .\\axios.js (mode: 'all')
import nuxt_plugin_sentryserver_68cde04c from 'nuxt_plugin_sentryserver_68cde04c' // Source: .\\sentry.server.js (mode: 'server')
import nuxt_plugin_sentryclient_03146ec4 from 'nuxt_plugin_sentryclient_03146ec4' // Source: .\\sentry.client.js (mode: 'client')
import nuxt_plugin_router_2fc87427 from 'nuxt_plugin_router_2fc87427' // Source: .\\router.js (mode: 'all')
import nuxt_plugin_buefy_354d55e2 from 'nuxt_plugin_buefy_354d55e2' // Source: ..\\plugins\\buefy (mode: 'all')
import nuxt_plugin_lineclamp_3d6f6598 from 'nuxt_plugin_lineclamp_3d6f6598' // Source: ..\\plugins\\line-clamp (mode: 'client')
import nuxt_plugin_directives_d0867c0c from 'nuxt_plugin_directives_d0867c0c' // Source: ..\\plugins\\directives (mode: 'all')
import nuxt_plugin_vuelidate_4345260a from 'nuxt_plugin_vuelidate_4345260a' // Source: ..\\plugins\\vuelidate (mode: 'all')
import nuxt_plugin_divue_6f0ea998 from 'nuxt_plugin_divue_6f0ea998' // Source: ..\\plugins\\di-vue (mode: 'all')
import nuxt_plugin_materialdesignicons_b188790a from 'nuxt_plugin_materialdesignicons_b188790a' // Source: ..\\plugins\\material-design-icons (mode: 'all')
import nuxt_plugin_vueinfiniteloading_ba354f40 from 'nuxt_plugin_vueinfiniteloading_ba354f40' // Source: ..\\plugins\\vue-infinite-loading (mode: 'all')
import nuxt_plugin_vuescrollto_27a6f23e from 'nuxt_plugin_vuescrollto_27a6f23e' // Source: ..\\plugins\\vue-scroll-to (mode: 'all')
import nuxt_plugin_vuesticky_0ac61ff4 from 'nuxt_plugin_vuesticky_0ac61ff4' // Source: ..\\plugins\\vue-sticky (mode: 'all')
import nuxt_plugin_vuemoment_1fc97fc6 from 'nuxt_plugin_vuemoment_1fc97fc6' // Source: ..\\plugins\\vue-moment (mode: 'all')
import nuxt_plugin_vuepopper_1589616e from 'nuxt_plugin_vuepopper_1589616e' // Source: ..\\plugins\\vue-popper (mode: 'all')
import nuxt_plugin_vueprogressiveimage_bd141b48 from 'nuxt_plugin_vueprogressiveimage_bd141b48' // Source: ..\\plugins\\vue-progressive-image (mode: 'all')
import nuxt_plugin_vuevideoplayer_6f52f4d0 from 'nuxt_plugin_vuevideoplayer_6f52f4d0' // Source: ..\\plugins\\vue-video-player (mode: 'all')
import nuxt_plugin_vuehighlight_33b38512 from 'nuxt_plugin_vuehighlight_33b38512' // Source: ..\\plugins\\vue-highlight (mode: 'all')
import nuxt_plugin_vuetooltip_f49054f4 from 'nuxt_plugin_vuetooltip_f49054f4' // Source: ..\\plugins\\vue-tooltip (mode: 'all')
import nuxt_plugin_vuerx_301d3a3a from 'nuxt_plugin_vuerx_301d3a3a' // Source: ..\\plugins\\vue-rx (mode: 'all')
import nuxt_plugin_vuenotvisible_5644f10a from 'nuxt_plugin_vuenotvisible_5644f10a' // Source: ..\\plugins\\vue-not-visible (mode: 'all')
import nuxt_plugin_vclipboard_17e9386e from 'nuxt_plugin_vclipboard_17e9386e' // Source: ..\\plugins\\v-clipboard (mode: 'all')
import nuxt_plugin_quillplugin_19645052 from 'nuxt_plugin_quillplugin_19645052' // Source: ..\\plugins\\quill-plugin (mode: 'client')
import nuxt_plugin_eventBus_aaeb250a from 'nuxt_plugin_eventBus_aaeb250a' // Source: ..\\plugins\\eventBus.js (mode: 'all')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Object.defineProperty(Vue.prototype, '$nuxt', {
  get() {
    const globalNuxt = this.$root ? this.$root.$options.$nuxt : null
    if (process.client && !globalNuxt && typeof window !== 'undefined') {
      return window.$nuxt
    }
    return globalNuxt
  },
  configurable: true
})

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":true,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

async function createApp(ssrContext, config = {}) {
  const store = null
  const router = await createRouter(ssrContext, config, { store })

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"Web.Openspace.Social","script":[{"src":"https:\u002F\u002Fpagead2.googlesyndication.com\u002Fpagead\u002Fjs\u002Fadsbygoogle.js","data-ad-client":"ca-pub-7857527391137735","async":true}],"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1.0"},{"hid":"description","name":"description","content":"Ethical social network."},{"name":"theme-color","content":"#ffffff"},{"name":"msapplication-TileColor","content":"#000000"},{"property":"og:title","content":"Openspace"},{"property":"og:description","content":"Ethical Social Network."},{"property":"og:image","content":"https:\u002F\u002Fokuna.io\u002Fog-image.png"}],"link":[{"rel":"icon","type":"image\u002Fx-icon","href":"favicon.ico"},{"rel":"icon","type":"image\u002Fpng","href":"favicon.ico"},{"rel":"icon","type":"image\u002Fpng","sizes":"32x32","href":"favicon-32x32.png"},{"rel":"icon","type":"image\u002Fpng","sizes":"16x16","href":"favicon-16x16.png"},{"rel":"apple-touch-icon","sizes":"180x180","href":"apple-touch-icon.png"},{"rel":"mask-icon","href":"\u002Fsafari-pinned-tab.svg","color":"#ffffff"}],"style":[]},

    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    beforeSerializeFns: ssrContext ? ssrContext.beforeSerializeFns : undefined,
    ssrContext
  })

  function inject(key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value
    // Add into context
    if (!app.context[key]) {
      app.context[key] = value
    }

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue.prototype, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Inject runtime config as $config
  inject('config', config)

  // Add enablePreview(previewData = {}) in context for plugins
  if (process.static && process.client) {
    app.context.enablePreview = function (previewData = {}) {
      app.previewData = Object.assign({}, previewData)
      inject('preview', previewData)
    }
  }
  // Plugin execution

  if (typeof nuxt_plugin_pluginrouting_22b8d2b1 === 'function') {
    await nuxt_plugin_pluginrouting_22b8d2b1(app.context, inject)
  }

  if (typeof nuxt_plugin_pluginmain_46db7e5e === 'function') {
    await nuxt_plugin_pluginmain_46db7e5e(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_localforage_68916d1d === 'function') {
    await nuxt_plugin_localforage_68916d1d(app.context, inject)
  }

  if (typeof nuxt_plugin_axios_8cadaef0 === 'function') {
    await nuxt_plugin_axios_8cadaef0(app.context, inject)
  }

  if (process.server && typeof nuxt_plugin_sentryserver_68cde04c === 'function') {
    await nuxt_plugin_sentryserver_68cde04c(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_sentryclient_03146ec4 === 'function') {
    await nuxt_plugin_sentryclient_03146ec4(app.context, inject)
  }

  if (typeof nuxt_plugin_router_2fc87427 === 'function') {
    await nuxt_plugin_router_2fc87427(app.context, inject)
  }

  if (typeof nuxt_plugin_buefy_354d55e2 === 'function') {
    await nuxt_plugin_buefy_354d55e2(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_lineclamp_3d6f6598 === 'function') {
    await nuxt_plugin_lineclamp_3d6f6598(app.context, inject)
  }

  if (typeof nuxt_plugin_directives_d0867c0c === 'function') {
    await nuxt_plugin_directives_d0867c0c(app.context, inject)
  }

  if (typeof nuxt_plugin_vuelidate_4345260a === 'function') {
    await nuxt_plugin_vuelidate_4345260a(app.context, inject)
  }

  if (typeof nuxt_plugin_divue_6f0ea998 === 'function') {
    await nuxt_plugin_divue_6f0ea998(app.context, inject)
  }

  if (typeof nuxt_plugin_materialdesignicons_b188790a === 'function') {
    await nuxt_plugin_materialdesignicons_b188790a(app.context, inject)
  }

  if (typeof nuxt_plugin_vueinfiniteloading_ba354f40 === 'function') {
    await nuxt_plugin_vueinfiniteloading_ba354f40(app.context, inject)
  }

  if (typeof nuxt_plugin_vuescrollto_27a6f23e === 'function') {
    await nuxt_plugin_vuescrollto_27a6f23e(app.context, inject)
  }

  if (typeof nuxt_plugin_vuesticky_0ac61ff4 === 'function') {
    await nuxt_plugin_vuesticky_0ac61ff4(app.context, inject)
  }

  if (typeof nuxt_plugin_vuemoment_1fc97fc6 === 'function') {
    await nuxt_plugin_vuemoment_1fc97fc6(app.context, inject)
  }

  if (typeof nuxt_plugin_vuepopper_1589616e === 'function') {
    await nuxt_plugin_vuepopper_1589616e(app.context, inject)
  }

  if (typeof nuxt_plugin_vueprogressiveimage_bd141b48 === 'function') {
    await nuxt_plugin_vueprogressiveimage_bd141b48(app.context, inject)
  }

  if (typeof nuxt_plugin_vuevideoplayer_6f52f4d0 === 'function') {
    await nuxt_plugin_vuevideoplayer_6f52f4d0(app.context, inject)
  }

  if (typeof nuxt_plugin_vuehighlight_33b38512 === 'function') {
    await nuxt_plugin_vuehighlight_33b38512(app.context, inject)
  }

  if (typeof nuxt_plugin_vuetooltip_f49054f4 === 'function') {
    await nuxt_plugin_vuetooltip_f49054f4(app.context, inject)
  }

  if (typeof nuxt_plugin_vuerx_301d3a3a === 'function') {
    await nuxt_plugin_vuerx_301d3a3a(app.context, inject)
  }

  if (typeof nuxt_plugin_vuenotvisible_5644f10a === 'function') {
    await nuxt_plugin_vuenotvisible_5644f10a(app.context, inject)
  }

  if (typeof nuxt_plugin_vclipboard_17e9386e === 'function') {
    await nuxt_plugin_vclipboard_17e9386e(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_quillplugin_19645052 === 'function') {
    await nuxt_plugin_quillplugin_19645052(app.context, inject)
  }

  if (typeof nuxt_plugin_eventBus_aaeb250a === 'function') {
    await nuxt_plugin_eventBus_aaeb250a(app.context, inject)
  }

  // Lock enablePreview in context
  if (process.static && process.client) {
    app.context.enablePreview = function () {
      console.warn('You cannot call enablePreview() outside a plugin.')
    }
  }

  // Wait for async component to be resolved first
  await new Promise((resolve, reject) => {
    // Ignore 404s rather than blindly replacing URL in browser
    if (process.client) {
      const { route } = router.resolve(app.context.route.fullPath)
      if (!route.matched.length) {
        return resolve()
      }
    }
    router.replace(app.context.route.fullPath, resolve, (err) => {
      // https://github.com/vuejs/vue-router/blob/v3.4.3/src/util/errors.js
      if (!err._isRouter) return reject(err)
      if (err.type !== 2 /* NavigationFailureType.redirected */) return resolve()

      // navigated to a different route in router guard
      const unregister = router.afterEach(async (to, from) => {
        if (process.server && ssrContext && ssrContext.url) {
          ssrContext.url = to.fullPath
        }
        app.context.route = await getRouteData(to)
        app.context.params = to.params || {}
        app.context.query = to.query || {}
        unregister()
        resolve()
      })
    })
  })

  return {
    app,
    router
  }
}

export { createApp, NuxtError }
