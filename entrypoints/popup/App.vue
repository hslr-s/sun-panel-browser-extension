<script lang="ts" setup>
import { NAlert, NButton, NCard, NConfigProvider, NDivider, NH3, NH4, NH5, NImage, NInput, NScrollbar, createDiscreteApi } from 'naive-ui'
import { Refresh as RefreshIcon, SettingsSharp as SettingsIcon } from '@vicons/ionicons5'
import Home from '@/components/Home.vue'
import { useTheme } from '@/hooks/useTheme'
import { useAppStore } from '@/store'

const { themeOverrides } = useTheme()

function handleSetting() {
  browser.tabs.create({ url: 'settings.html' })
}
</script>

<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
  >
    <div class="root">
      <div class="header flex items-center">
        <div class="text-[#fff] text-xl font-bold">
          Sun-Panel -BE
        </div>
        <div class="ml-auto">
          <NButton size="small" @click="handleSetting">
            <template #icon>
              <SettingsIcon style="color: white;" />
            </template>
          </NButton>
        </div>
      </div>

      <NScrollbar style="max-height: 500px;padding:0 20px">
        <Home msg="Sun-Panel" />
      </NScrollbar>

      <div class="foot " />
    </div>
  </NConfigProvider>
</template>

<style scoped>
.header{
  padding:10px 20px;
  background-color: #4EB4BC;
}

.foot{
  height: 5px;
  background-color: #4EB4BC;
}

.root{
  min-width: 400px;
  max-width: 500px;
}
</style>

<style>
html,
body {
  overflow: hidden;
}
</style>
