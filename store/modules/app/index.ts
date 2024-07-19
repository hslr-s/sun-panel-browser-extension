import { defineStore } from 'pinia'
import type { AppState, Language, Theme } from './helper'
import { defaultSetting, getLocalSetting, removeLocalState, setLocalSetting } from './helper'
import { store } from '@/store'
import { useTheme } from '@/hooks/useTheme'

export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    ...defaultSetting(), // 使用默认设置初始化状态
  }),
  actions: {
    async initialize() {
      console.log('初始胡')
      const localSettings = await getLocalSetting()
      this.$state = { ...this.$state, ...localSettings }
    },

    setTheme(theme: Theme) {
      this.theme = theme
      this.recordState()
    },

    setLanguage(language: Language) {
      if (this.language !== language) {
        this.language = language
        this.recordState()
      }
    },

    getTheme() {
      const { theme } = useTheme()
      return theme

      // const appStore = useAppStore();
      // console.log('主题', appStore.theme);
      // if (appStore.theme === 'auto')
      //   return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? darkTheme : lightTheme;

      // else if (appStore.theme === 'light')
      //   return lightTheme;

      // else
      //   return darkTheme;
    },

    setSiteSetting(siteSetting: GlobalSetting.SiteSetting) {
      this.siteSetting = siteSetting
      this.recordState()
    },

    recordState() {
      setLocalSetting(this.$state)
    },

    removeToken() {
      this.$state = defaultSetting()
      removeLocalState()
    },
  },
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
