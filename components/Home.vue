<script lang="ts" setup>
import { ref } from 'vue';


defineProps({
  msg: String,
});

const currentUrl = ref("");

// 存储数据
localStorage.setItem('config', JSON.stringify({ key: 'value' }));

// 读取数据
const config = JSON.parse(localStorage.getItem('config') || "");


function getUrl() {
  browser.tabs.query
  // currentUrl.value = window.location.href;
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs)=>{
    var currentTab = tabs[0];
    currentUrl.value = currentTab.url || "";
    console.log("当前页面地址是：" + currentUrl);
  })
}
const count = ref(0);
</script>

<template>
  <h1 class="text-[#4EB4BC]">{{ msg }}</h1>

  <button type="button" class="mt-2" @click="getUrl">获取当前页面地址</button>

  <div>{{ currentUrl }}</div>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the WXT and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
