import { defineConfig } from 'wxt'
import vueI18n from '@intlify/unplugin-vue-i18n/vite'
// import vue from '@vitejs/plugin-vue'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  vite: () => ({
    plugins: [
      // vue(),
      vueI18n({
        include: 'assets/locales/*.json',
      }),
    ],
  }),
  manifest: {
    permissions: ['storage'],
    // name: 'Sun-Panel BE',
    version: '0.1.3',
    version_name: '0.1.3-beta',
    host_permissions: ['https://*/*', 'http://*/*', '*://*/*'],
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
  },
})
