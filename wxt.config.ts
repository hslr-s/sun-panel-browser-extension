import { defineConfig } from 'wxt'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [
      // See https://vue-i18n.intlify.dev/guide/advanced/optimization.html
      vueI18n({
        include: 'assets/locales/*.json',
      }),
    ],
  }),
  manifest: {
    permissions: ['storage', 'scripting', 'activeTab', 'contextMenus'],
    name: 'Sun-Panel BE',
    version: '0.1.1',
    version_name: '0.1.1-beta',
    host_permissions: ['https://*/*', 'http://*/*', '*://*/*'],
  },
})
