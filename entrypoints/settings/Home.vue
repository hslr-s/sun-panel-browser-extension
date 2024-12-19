<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { NAlert, NButton, NCard, NDivider, NForm, NFormItem, NH1, NH2, NInput, NSelect, NSwitch, createDiscreteApi } from 'naive-ui'
import type { FormInst, FormItemRule } from 'naive-ui'
import type { Language, Theme } from '@/store/modules/app/helper'
import { useAppStore } from '@/store'
import { isValidHttpUrl } from '@/util/verifyRules'
import { STip } from '@/components'
import { getSunPanelVersion } from '@/api'
import { removeTrailingSlash } from '@/util/cmn'

const { t, locale } = useI18n()

interface OpenAPIConfig extends BaseType.OpenAPIConfig {
}

interface HomePageConfig extends BaseType.HomePageConfig {
}

const ms = createDiscreteApi(['message', 'dialog'])
const appStore = useAppStore()
const openApiFormValue = ref<OpenAPIConfig>({
  host: '',
  token: '',
})

const homePageFormValue = ref<HomePageConfig>({
  url: '',
  spareUrl: '',
  homePageInIframe: false,
})

// const appName = browser.runtime.getManifest().name
// const themeOptions: { label: string, key: string, value: Theme }[] = [
//   { label: '深色', key: 'dark', value: 'dark' },
//   { label: '浅色', key: 'light', value: 'light' },
//   { label: '自动', key: 'Auto', value: 'auto' },
// ]

const languageOptions: { label: string, key: Language, value: Language }[] = [
  { label: 'English', key: 'en-US', value: 'en-US' },
  { label: '简体中文', key: 'zh-CN', value: 'zh-CN' },
]

const openApiRules = {
  host: [
    {
      required: true,
      message: t('form.required'),
      trigger: ['blur'],
    },
    {
      trigger: ['blur'],
      message: t('form.httpUrlIncorrect'),
      validator(rule: FormItemRule, value: string) {
        return isValidHttpUrl(value)
      },
    },
  ],
  token: {
    required: true,
    message: t('form.required'),
    trigger: ['blur'],
  },
}

const homePageRules = {
  url: [
    {
      required: true,
      message: t('form.required'),
      trigger: ['blur'],
    },
    {
      trigger: ['blur'],
      message: t('form.httpUrlIncorrect'),
      validator(rule: FormItemRule, value: string) {
        return isValidHttpUrl(value)
      },
    },
  ],
  spareUrl: {
    trigger: ['input', 'blur'],
    message: t('form.httpUrlIncorrect'),
    validator(rule: FormItemRule, value: string) {
      return value === '' || isValidHttpUrl(value)
    },
  },
}

const openApiFormRef = ref<FormInst | null>(null)
const homePageFormRef = ref<FormInst | null>(null)
const languageValue = ref(appStore.language)
// const themeValue = ref(appStore.theme)

watch(() => appStore.language, (value) => {
  languageValue.value = value
})

function handleUpdatehomePageInIframe(v: boolean) {
  if (v) {
    ms.dialog.warning({
      title: t('common.warning'),
      content: t('setting.homePageInIframeTip'),
      positiveText: t('common.enable'),
      negativeText: t('common.disable'),
      onNegativeClick: () => {
        homePageFormValue.value.homePageInIframe = false
      },
    })
  }
}

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
      storage.setItem('local:homePageConfig', { ...homePageFormValue.value }).then(() => {
        ms.message.success(t('common.saveSuccess'))
      }).catch((err) => {
        ms.message.error(t('common.saveFail'))
        console.error(err)
      })
    }
    else {
      console.error(errors)
      ms.message.error(t('form.error'))
    }
  })
}

function handleSaveOpenAPIConfig(e: MouseEvent) {
  e.preventDefault()
  openApiFormRef.value?.validate((errors) => {
    if (!errors) {
      storage.setItem('local:openAPIConfig', { ...openApiFormValue.value }).then(() => {
        ms.message.success(t('common.saveSuccess'))
      }).catch((err) => {
        ms.message.error(t('common.saveFail'))
        console.error(err)
      })
    }
    else {
      console.error(errors)
      ms.message.error(t('form.error'))
    }
  })
}

function handleChangeLanuage(value: Language) {
  languageValue.value = value
  locale.value = value
  appStore.setLanguage(value)
  // location.reload()
}

function handleConnectionTest() {
  getSunPanelVersion<SunPanelVersion.Info>(openApiFormValue.value.host, openApiFormValue.value.token).then(({ data }) => {
    ms.message.success(t('settings.connectionTestSuccess', { version: `v${data.version}`, versionCode: data.versionCode }), {
      closable: true,
      duration: 10000,
    })
  }).catch((err) => {
    ms.message.error(t('common.connectionTestFail'), {
      closable: true,
      duration: 20000,
    })
    console.error(err)
  })
}
// function handleChangeTheme(value: Theme) {
//   themeValue.value = value
//   appStore.setTheme(value)
//   // location.reload()
// }
</script>

<template>
  <div class="mx-auto max-w-[600px] my-20">
    <NH2 class="font-bold">
      Sun-Panel <span class="text-sm">( For Browser Extension )</span> {{ t('common.settings') }}
    </NH2>

    <NCard style="border-radius: 1rem">
      <template #header>
        {{ $t('settings.interface') }}
      </template>

      <div class="mt-[10px]">
        <div class="text-slate-500 font-bold">
          {{ $t('common.language') }}
        </div>
        <div class="max-w-[200px]">
          <NSelect v-model:value="languageValue" :options="languageOptions" @update-value="handleChangeLanuage" />
        </div>
      </div>

      <!-- <div class="mt-[10px]">
        <div class="text-slate-500 font-bold">
          主题
        </div>
        <div class="max-w-[200px]">
          <NSelect v-model:value="themeValue" :options="themeOptions" @update-value="handleChangeTheme" />
        </div>
      </div> -->
    </NCard>

    <NCard style="border-radius: 1rem;margin-top: 10px;">
      <template #header>
        {{ t('common.newTab') }}
      </template>

      <NForm ref="homePageFormRef" :label-width="80" :model="homePageFormValue" :rules="homePageRules" size="small">
        <!-- <NDivider title-placement="left">
          {{ t('settings.homePageUrl') }}
        </NDivider> -->

        <div class="my-2">
          <NAlert type="info" closable size="small">
            {{ t('settings.homePageUrlNote') }}
          </NAlert>
        </div>

        <NFormItem path="url">
          <template #label>
            <div class="text-slate-500 font-bold">
              {{ t('settings.mainUrl') }}
            </div>
          </template>
          <NInput v-model:value="homePageFormValue.url" />
        </NFormItem>

        <NFormItem path="spareUrl">
          <template #label>
            <div class="text-slate-500 font-bold">
              {{ t('settings.spareUrl') }}
            </div>
          </template>
          <NInput v-model:value="homePageFormValue.spareUrl" />
        </NFormItem>

        <NFormItem>
          <template #label>
            <span class="flex items-center text-slate-500 font-bold">
              [Beta] {{ t('settings.homePageInIframe') }}
              <STip class="text-base flex items-center">
                <div class=" max-w-[400px]">
                  {{ t('setting.homePageInIframeTip') }}
                </div>
              </STip>
            </span>
          </template>
          <NSwitch v-model:value="homePageFormValue.homePageInIframe" @update:value="handleUpdatehomePageInIframe" />
        </NFormItem>

        <NFormItem>
          <div class="flex justify-end">
            <NButton attr-type="button" type="success" @click="handleSaveHomePageConfig">
              {{ t('common.save') }}
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
          {{ t('settings.openAPINote', { version: "v1.4.0-beta24-04-11+" }) }}
          <p class="mt-2">
            {{ t("settings.guideOpenAPI") }}
          </p>
        </NAlert>
      </div>

      <NForm ref="openApiFormRef" :label-width="80" :model="openApiFormValue" :rules="openApiRules" size="small">
        <NFormItem path="host">
          <template #label>
            <span class="text-slate-500 font-bold">
              {{ t('common.urlAddress') }}
            </span>
            <span class="text-slate-400">
              (eg: http://192.168.3.100:3002/openapi/v1)
            </span>
          </template>
          <NInput v-model:value="openApiFormValue.host" placeholder="eg: http://192.168.3.100:3002/openapi/v1" />
        </NFormItem>
        <NFormItem label="Token" path="token">
          <template #label>
            <span class="text-slate-500 font-bold">
              Token
            </span>
          </template>
          <NInput v-model:value="openApiFormValue.token" type="password" />
          <NButton attr-type="button" type="info" :disabled="openApiFormValue.host === '' || openApiFormValue.token === ''" @click="handleConnectionTest">
            {{ t('common.connectionTest') }}
          </NButton>
        </NFormItem>

        <NFormItem>
          <NButton attr-type="button" type="success" @click="handleSaveOpenAPIConfig">
            {{ t('common.save') }}
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </div>
</template>
