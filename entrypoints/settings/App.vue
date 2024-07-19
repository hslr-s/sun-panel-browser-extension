<script lang="ts" setup>
import { NConfigProvider } from 'naive-ui'
import Home from './Home.vue'
import backgroundImg from '@/assets/defaultBackground.webp'
import { useTheme } from '@/hooks/useTheme'

const { themeOverrides } = useTheme()
</script>

<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
  >
    <div
      class="background dark:bg-[#18181B]"
      :style="{ backgroundImage: `url(${backgroundImg})` }"
    >
      <Home class="mt-10" />
    </div>
  </NConfigProvider>
</template>

<style scoped>
.background {
  overflow-y: auto;
  position: absolute;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-color: #ddd;
}
</style>
