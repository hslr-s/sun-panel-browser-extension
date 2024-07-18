<script lang="ts" setup>
import Home from './Home.vue'
import backgroundImg from '@/assets/defaultBackground.webp'
</script>

<template>
  <div class="background" :style="{ backgroundImage: `url(${backgroundImg})` }">
    <div class="p-[20px]">
      <Home />
    </div>
  </div>
</template>

<style scoped>
.html body{
  overflow: hidden;
}

.background {
  overflow-y: auto;
  position: absolute;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-color: #18181b;
}

@media (prefers-color-scheme: light) {
 .background {
    color: #213547;
    background-color: #ffffff;
  }
}
</style>
