<script lang="ts" setup>
import { NConfigProvider } from 'naive-ui'
import Home from '@/components/Home.vue'
import { useTheme } from '@/hooks/useTheme'
import { useAppStore } from '@/store'

const appStore = useAppStore()

const { theme, themeOverrides } = useTheme()

console.log(appStore.theme)
</script>

<template>
  <NConfigProvider
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <div class="root dark:bg-[#18181B]">
      <Home msg="Sun-Panel" />
    </div>
  </NConfigProvider>
</template>

<style scoped>
.root{
  padding: 20px;
  min-width: 400px;
  min-height: 400px;
  max-width: 500px;
  overflow: auto;
}
</style>

<style>
html,
body {
  overflow: hidden;
  background-color: black;
}
</style>
