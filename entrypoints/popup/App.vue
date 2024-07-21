<script lang="ts" setup>
import { NButton, NConfigProvider, NScrollbar } from 'naive-ui'
import { HelpSharp as HelpIcon, SettingsSharp as SettingsIcon } from '@vicons/ionicons5'
import Home from '@/components/Home.vue'
import { useTheme } from '@/hooks/useTheme'
import { useAppStore } from '@/store'
import { useLanguage } from '@/hooks/useLanguage'

const { language } = useLanguage()
const { t } = useI18n()

const appStore = useAppStore()
const { themeOverrides } = useTheme()
const sortLinkHost = 'http://links.sun-panel.top'

function handleSetting() {
  browser.tabs.create({ url: 'settings.html' })
}

function handleDocOpen() {
  let url = `${sortLinkHost}/browser_plugin_doc_en`
  if (appStore.language === 'zh-CN') {
    url = `${sortLinkHost}/browser_plugin_doc_zh_cn`
  }
  browser.tabs.create({ url })
}

function handleUpdateLog() {
  let url = `${sortLinkHost}/browser_plugin_update_log_en`
  if (appStore.language === 'zh-CN') {
    url = `${sortLinkHost}/browser_plugin_update_log_zh_cn`
  }
  browser.tabs.create({ url })
}

const version_name = browser.runtime.getManifest().version_name
const appName = browser.runtime.getManifest().name
</script>

<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <div class="root">
      <div class="header flex items-center">
        <div class="text-[#fff] text-xl font-bold">
          {{ appName }}
          <span
            class="text-sm cursor-pointer text-[#00eafd] hover:text-[#000]"
            :title="t('popup.uploadLog')"
            @click="handleUpdateLog"
          >
            (v{{ version_name }})
          </span>
        </div>
        <div class="ml-auto">
          <NButton size="tiny" style="margin-right: 5px;" @click="handleDocOpen">
            <template #icon>
              <HelpIcon style="color: white;" />
            </template>
          </NButton>

          <NButton size="tiny" @click="handleSetting">
            <template #icon>
              <SettingsIcon style="color: white;" />
            </template>
          </NButton>
        </div>
      </div>

      <div class="bg-[white] rounded-t-2xl shadow-xl border">
        <NScrollbar style="max-height: 500px;padding:0 20px">
          <Home msg="Sun-Panel" />
        </NScrollbar>
      </div>
    </div>
  </NConfigProvider>
</template>

<style scoped>
.header{
  padding:8px 20px;
}

.root{
  min-width: 400px;
  max-width: 500px;
  background-color: #4EB4BC;
}
</style>

<style>
html,
body {
  overflow: hidden;
}
</style>
