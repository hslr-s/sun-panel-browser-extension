<script lang="ts" setup>
import { ref } from 'vue'
import { NAlert, NButton, NDivider, NH3, NImage, NInput, createDiscreteApi } from 'naive-ui'
import { Refresh as RefreshIcon, SettingsSharp as SettingsIcon } from '@vicons/ionicons5'
import * as cheerio from 'cheerio'

defineProps({
  msg: String,
})

interface OpenAPIConfig {
  host: string
  token: string
}

interface ImageListItem {
  iconUrl: string
  checked: boolean
}

const ms = createDiscreteApi(['message'])
const currentUrl = ref('')
const webSiteIcons = ref<ImageListItem[]>([])
const openApiConfig = ref<OpenAPIConfig>({
  host: '',
  token: '',
})
const formValue = ref({
  title: '',
  url: '',
  lanUrl: '',
  iconUrl: '',
})

function handleSetting() {
  browser.tabs.create({ url: 'settings.html' })
}

async function getUrl() {
  // browser.tabs.query
  // currentUrl.value = window.location.href;
  await browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const currentTab = tabs[0]
    currentUrl.value = currentTab.url || ''
    console.log(`当前页面地址是：${currentUrl.value}`)
  })
}

function getIcoLinks(html: string): string[] {
  const $ = cheerio.load(html)
  const icoTags = $('link[rel="shortcut icon"], link[rel="icon"]')
  const links: string[] = []

  icoTags.each((index, element) => {
    const tag = $(element)
    const href = tag.attr('href')
    if (href) {
      console.log(href)
      links.push(href)
    }
  })

  return links
}

// fetch('http://panel.nas.enianteam.com:8080/openapi/v1/item/create', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     key1: 'value1',
//     key2: 'value2',
//   }),
// })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Error:', error))

async function fetchWebsiteSource(url: string) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    // console.log(html)
    return html
  }
  catch (error) {
    console.error('Error fetching website source:', error)
    return null
  }
}

function parseIconUrl(url: string, baseUrl: string): string {
  const urlObj = new URL(url, baseUrl)

  // 判断是否是绝对地址
  if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
    return urlObj.toString()
  }

  // 如果不是绝对地址，则使用基地址进行解析拼接
  return baseUrl + url
}

async function getIconAndUrl() {
  await getUrl()
  webSiteIcons.value = []
  // currentUrl.value = 'http://192.168.3.41/cgi-bin/luci/'
  formValue.value.url = currentUrl.value
  fetchWebsiteSource(currentUrl.value).then((html) => {
    if (html) {
      const icons = getIcoLinks(html || '')

      for (let i = 0; i < icons.length; i++) {
        const element = icons[i]
        const iconUrl = parseIconUrl(element, currentUrl.value)
        webSiteIcons.value.push({ iconUrl, checked: i === 0 })
        if (i === 0) {
          formValue.value.iconUrl = iconUrl
        }
      // console.log(iconUrl)
      }

      if (icons.length === 0) {
        const urlObj = new URL(currentUrl.value, currentUrl.value)
        // 没有找到图标使用默认图标
        const iconUrl = `${urlObj.protocol}//${urlObj.host}/favicon.ico`
        webSiteIcons.value.push({ iconUrl, checked: true })
        formValue.value.iconUrl = iconUrl
      }
    }
  })
}

function handleSelectIcon(icon: ImageListItem) {
  formValue.value.iconUrl = icon.iconUrl
  for (let i = 0; i < webSiteIcons.value.length; i++) {
    const element = webSiteIcons.value[i]
    webSiteIcons.value[i].checked = false
    if (element.iconUrl === icon.iconUrl) {
      webSiteIcons.value[i].checked = true
    }
  }
}

function removeTrailingSlash(str: string) {
  if (!str)
    return str // 如果字符串为空或未定义，直接返回
  return str.replace(/\/+$/, '')
}

function handleSave() {
  console.log(formValue.value)

  // 没有找到图标使用默认图标
  const url = `${removeTrailingSlash(openApiConfig.value.host)}/item/create`

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': openApiConfig.value.token,
    },
    body: JSON.stringify(formValue.value),
  })
    .then(response => response.json())
    .then((data) => {
      if (data.code === 0) {
        ms.message.success('保存成功')
      }
      else {
        ms.message.error('保存失败')
      }
    })
    .catch((error) => {
      console.error('Error:', error)
      ms.message.error('保存失败')
    })
}

onMounted(() => {
  storage.getItem<OpenAPIConfig>('local:openAPIConfig').then((cfg) => {
    if (cfg) {
      openApiConfig.value = cfg as OpenAPIConfig
    }
  })
  getIconAndUrl()
})
</script>

<template>
  <div class="header flex items-center">
    <h1 class="text-[#4EB4BC] text-xl font-bold">
      {{ msg }}-BE
    </h1>
    <div class="ml-auto">
      <NButton @click="handleSetting">
        <template #icon>
          <SettingsIcon />
        </template>
      </NButton>
    </div>
  </div>

  <NH3>
    <div class="flex items-center">
      <div class="mr-5">
        将本站添加到 Sun-Panel
      </div>

      <NButton size="tiny" type="info" ghost circle @click="getIconAndUrl">
        <template #icon>
          <RefreshIcon />
        </template>
      </NButton>
    </div>
  </NH3>

  <NDivider />

  <NAlert v-if="openApiConfig.host === '' || openApiConfig.token === ''" type="error">
    请先配置OpenApi参数，再尝试添加
    <div class="text-[blue] cursor-pointer" @click="handleSetting">
      去设置
    </div>
  </NAlert>

  <div class="mt-5">
    获取的图标：
    <div>
      <NImage
        v-for="icon, index in webSiteIcons"
        :key="index" preview-disabled
        :src="icon.iconUrl"
        class="cursor-pointer"
        style="width: 50px;height: 50px;border-radius: 5px;margin-right: 10px;padding:2px"
        :style="icon.checked ? 'border:2px #4EB4BC solid;' : 'border:1px #C1C6CC solid;'"
        @click="handleSelectIcon(icon)"
      />
      <!-- <div>{{ icon }}</div> -->
    </div>
  </div>

  <div class="mt-5">
    标题：
    <NInput
      v-model:value="formValue.title" size="small"
      :disabled="openApiConfig.host === '' || openApiConfig.token === ''"
    />
  </div>

  <div class="mt-5">
    地址：
    <NInput
      v-model:value="formValue.url" size="small"
      :disabled="openApiConfig.host === '' || openApiConfig.token === ''"
    />
  </div>

  <div class="mt-5">
    内网地址：
    <NInput
      v-model:value="formValue.lanUrl" size="small"
      :disabled="openApiConfig.host === '' || openApiConfig.token === ''"
    />
  </div>

  <div class="mt-5">
    <NButton
      type="success" style="width: 100%;"
      :disabled="openApiConfig.host === '' || openApiConfig.token === ''" @click="handleSave"
    >
      保存
    </NButton>
  </div>

  <!-- <div>{{ currentUrl }}</div> -->
</template>

<style scoped></style>
