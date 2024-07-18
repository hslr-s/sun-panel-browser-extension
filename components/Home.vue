<script lang="ts" setup>
import { ref } from 'vue';
import { NButton } from "naive-ui";


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
  <div class="header flex items-center">
    <h1 class="text-[#4EB4BC]">{{ msg }}</h1>
    <div class="ml-auto">
      <NButton>设置</NButton>
    </div>
  </div>

 

  <button type="button" class="mt-2" @click="getUrl">获取当前页面地址</button>

  <NButton>设置</NButton>
  <div>{{ currentUrl }}</div>
 
</template>

<style scoped>

</style>