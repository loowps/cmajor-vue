import './assets/base.css'
import { createApp, type App as VueApplication } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from '@/App.vue'
import type { PatchConnection } from '@/models/patch-connection.model'

export const cmajViewElementTag = 'cmaj-view'
const stylesheetHref = new URL('./style.css', import.meta.url).href

function loadStylesheet(): Promise<void> {
  if (import.meta.env.DEV) {
    return Promise.resolve()
  }

  if (document.head.querySelector(`link[href="${stylesheetHref}"]`)) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = stylesheetHref
    link.addEventListener('load', () => resolve(), { once: true })
    link.addEventListener('error', () => resolve(), { once: true })
    document.head.appendChild(link)
  })
}

const stylesheetLoaded = loadStylesheet()

class CmajApp extends HTMLElement {
  private patchConnection?: PatchConnection
  private vueApp?: VueApplication

  constructor(patchConnection: PatchConnection) {
    super()
    this.patchConnection = patchConnection
  }

  async connectedCallback() {
    await stylesheetLoaded

    if (!this.isConnected || this.vueApp) {
      return
    }

    this.vueApp = createApp(App)
      .use(createPinia())
      .use(router)
      .provide('patchConnection', this.patchConnection)

    this.vueApp.mount(this)
  }

  disconnectedCallback() {
    this.vueApp?.unmount()
    this.vueApp = undefined
  }
}

if (!customElements.get(cmajViewElementTag)) {
  customElements.define(cmajViewElementTag, CmajApp)
}

export default function createPatchView(patchConnection: PatchConnection) {
  return new CmajApp(patchConnection)
}
