import loginDefaultBackgroundUrl from '@/assets/defaultBackground.webp'

const LOCAL_NAME = 'appSetting'

export type Theme = 'light' | 'dark' | 'auto'

export type Language = 'zh-CN' | 'en-US'

export interface AppState {
  theme: Theme
  language: Language
  siteSetting: GlobalSetting.SiteSetting
}

export function defaultSetting(): AppState {
  const lan = (navigator.language).toLowerCase()
  let language: Language = 'en-US'
  if (lan.includes('zh'))
    language = 'zh-CN'

  const siteSetting: GlobalSetting.SiteSetting = {
    title: 'Sun-Panel',
    favicoUrl: '',
    loginBackgroundUrl: loginDefaultBackgroundUrl,
  }

  return { theme: 'auto', language, siteSetting }
}

export async function getLocalSetting(): Promise<AppState> {
  let data: AppState = { ...defaultSetting() }
  await storage.getItem<AppState>(`local:${LOCAL_NAME}`).then((localSetting) => {
    data = { ...defaultSetting(), ...localSetting }
  })
  return data
}

export function setLocalSetting(setting: AppState): void {
  storage.setItem(`local:${LOCAL_NAME}`, setting).then(() => {
    console.log('保存成功', `local:${LOCAL_NAME}`, setting)
  }).catch((err) => {
    console.error('保存失败', `local:${LOCAL_NAME}`, setting, err)
  })
}

export function removeLocalState() {
  storage.removeItem(`local:${LOCAL_NAME}`)
}
