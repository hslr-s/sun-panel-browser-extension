import { createI18n } from 'vue-i18n'
// Use your default locale when importing the schema
import messages from '@intlify/unplugin-vue-i18n/messages'
import type schema from '~/assets/locales/en-US.json'

import { useAppStore } from '@/store'

export type I18nSchema = typeof schema
export type I18nLocales = 'en-US' | 'zh-CN'

// const appStore = useAppStore()

export default createI18n<[I18nSchema], I18nLocales>({
  // locale: appStore.language,
  messages: messages as any,
})
