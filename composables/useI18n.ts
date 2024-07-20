import { useI18n } from 'vue-i18n'
import type { I18nLocales, I18nSchema } from '@/util/i18n'

export default function () {
  return useI18n<[I18nSchema], I18nLocales>()
}
