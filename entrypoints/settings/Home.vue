<script setup lang="ts">
import { ref } from 'vue'
import { NAlert, NButton, NCard, NForm, NFormItem, NH1, NH2, NInput, NSelect, NTag, createDiscreteApi } from 'naive-ui'
import type { FormInst, FormItemRule } from 'naive-ui'
import type { Language, Theme } from '@/store/modules/app/helper'
import { useAppStore } from '@/store'
import { isValidHttpUrl } from '@/util/verifyRules'

interface OpenAPIConfig {
  host: string
  token: string
}

interface HomePageConfig {
  url: string
  spareUrl: string
}

const ms = createDiscreteApi(['message'])
const appStore = useAppStore()
const openApiFormValue = ref<OpenAPIConfig>({
  host: '',
  token: '',
})

const homePageFormValue = ref<HomePageConfig>({
  url: '',
  spareUrl: '',
})

const themeOptions: { label: string, key: string, value: Theme }[] = [
  { label: '深色', key: 'dark', value: 'dark' },
  { label: '浅色', key: 'light', value: 'light' },
  { label: '自动', key: 'Auto', value: 'auto' },
]

const languageOptions: { label: string, key: Language, value: Language }[] = [
  { label: 'English', key: 'en-US', value: 'en-US' },
  { label: '简体中文', key: 'zh-CN', value: 'zh-CN' },
]

const openApiRules = {
  host: [
    {
      required: true,
      message: '必填项',
      trigger: ['blur'],
    },
    {
      trigger: ['blur'],
      message: '不是一个有效的url地址',
      validator(rule: FormItemRule, value: string) {
        return isValidHttpUrl(value)
      },
    },
  ],
  token: {
    required: true,
    message: '必填项',
    trigger: ['input', 'blur'],
  },
}

const homePageRules = {
  url: [
    {
      required: true,
      message: '必填项',
      trigger: ['input', 'blur'],
    },
    {
      trigger: ['blur'],
      message: '不是一个有效的url地址',
      validator(rule: FormItemRule, value: string) {
        return isValidHttpUrl(value)
      },
    },
  ],
  spareUrl: {
    trigger: ['input', 'blur'],
    message: '不是一个有效的url地址',
    validator(rule: FormItemRule, value: string) {
      return value === '' || isValidHttpUrl(value)
    },
  },
}

const openApiFormRef = ref<FormInst | null>(null)
const homePageFormRef = ref<FormInst | null>(null)
const languageValue = ref(appStore.language)
const themeValue = ref(appStore.theme)

onMounted(() => {
  getConfig()
})

function getConfig() {
  storage.getItem<HomePageConfig>('local:homePageConfig').then((cfg) => {
    if (cfg) {
      homePageFormValue.value = cfg as HomePageConfig
    }
  })

  storage.getItem<OpenAPIConfig>('local:openAPIConfig').then((cfg) => {
    if (cfg) {
      openApiFormValue.value = cfg as OpenAPIConfig
    }
  })
}

function handleSaveHomePageConfig(e: MouseEvent) {
  e.preventDefault()
  homePageFormRef.value?.validate((errors) => {
    if (!errors) {
      storage.setItem('local:homePageConfig', homePageFormValue.value).then(() => {
        ms.message.success('保存成功')
      }).catch((err) => {
        ms.message.error('保存失败，请稍后再试')
        console.error(err)
      })
    }
    else {
      console.error(errors)
      ms.message.error('保存失败，请检查表单是否有输入错误')
    }
  })
}

function handleSaveOpenAPIConfig(e: MouseEvent) {
  e.preventDefault()
  openApiFormRef.value?.validate((errors) => {
    if (!errors) {
      storage.setItem('local:openAPIConfig', openApiFormValue.value).then(() => {
        ms.message.success('保存成功')
      }).catch((err) => {
        ms.message.error('保存失败，请稍后再试')
        console.error(err)
      })
    }
    else {
      console.error(errors)
      ms.message.error('保存失败，请检查表单是否有输入错误')
    }
  })
}

function handleChangeLanuage(value: Language) {
  languageValue.value = value
  appStore.setLanguage(value)
  location.reload()
}

function handleChangeTheme(value: Theme) {
  themeValue.value = value
  appStore.setTheme(value)
  // location.reload()
}
</script>

<template>
  <div class="mx-auto max-w-[600px]">
    <NH2>Sun-Panel 设置</NH2>

    <NCard style="border-radius: 1rem">
      <template #header>
        界面设置
      </template>

      <div class="mt-[10px]">
        <div class="text-slate-500 font-bold">
          语言
        </div>
        <div class="max-w-[200px]">
          <NSelect v-model:value="languageValue" :options="languageOptions" @update-value="handleChangeLanuage" />
        </div>
      </div>

      <div class="mt-[10px]">
        <div class="text-slate-500 font-bold">
          主题
        </div>
        <div class="max-w-[200px]">
          <NSelect v-model:value="themeValue" :options="themeOptions" @update-value="handleChangeTheme" />
        </div>
      </div>
    </NCard>

    <NCard style="border-radius: 1rem;margin-top: 10px;">
      <template #header>
        首页地址
      </template>

      <div class="my-2">
        <NAlert type="info" closable size="small">
          当点击新标签页的时候，会自动跳转到首页地址，优先使用主要地址，如果主要地址链接不通的使用会使用备用地址。当您有内网和公网两个地址，推荐主要地址填写为内网地址。
        </NAlert>
      </div>
      <NForm ref="homePageFormRef" :label-width="80" :model="homePageFormValue" :rules="homePageRules" size="small">
        <NFormItem label="主要地址" path="url">
          <NInput v-model:value="homePageFormValue.url" />
        </NFormItem>

        <NFormItem label="备用地址" path="spareUrl">
          <NInput v-model:value="homePageFormValue.spareUrl" />
        </NFormItem>

        <NFormItem>
          <div class="flex justify-end">
            <NButton attr-type="button" type="success" @click="handleSaveHomePageConfig">
              保存
            </NButton>
          </div>
        </NFormItem>
      </NForm>
    </NCard>

    <NCard style="border-radius: 1rem;margin-top: 10px;">
      <template #header>
        OpenAPI
      </template>

      <div class="my-2">
        <NAlert type="info" closable size="small">
          通过 Sun-Panel 的 OpenAPI 来创建当前页面的图标，需要 Sun-Panel 版本在
          <NTag size="small">
            v1.4.0-beta24-04-11+
          </NTag>
        </NAlert>
      </div>

      <NForm ref="openApiFormRef" :label-width="80" :model="openApiFormValue" :rules="openApiRules" size="small">
        <NFormItem label="地址" path="host">
          <NInput v-model:value="openApiFormValue.host" />
        </NFormItem>
        <NFormItem label="token" path="token">
          <NInput v-model:value="openApiFormValue.token" type="password" />
        </NFormItem>
        <NFormItem>
          <NButton attr-type="button" type="success" @click="handleSaveOpenAPIConfig">
            保存
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </div>
</template>
