<script lang="ts" setup>
import { NConfigProvider } from 'naive-ui'
import Home from './Home.vue'
import backgroundImg from '@/assets/defaultBackground.webp'
import { useLanguage } from '@/hooks/useLanguage'

const { language } = useLanguage()
</script>

<template>
  <NConfigProvider
    :locale="language"
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
