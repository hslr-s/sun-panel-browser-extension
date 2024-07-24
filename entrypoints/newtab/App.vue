<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { NButton, NCard, NConfigProvider } from 'naive-ui'
import backgroundImg from '@/assets/defaultBackground.webp'
import { useLanguage } from '@/hooks/useLanguage'
import { push as statisticsPush } from '@/util/statistics'

const { t } = useI18n()

const { language } = useLanguage()

interface HomePageConfig extends BaseType.HomePageConfig {

}

const homePageConfig = ref<HomePageConfig>({
  url: '',
  spareUrl: '',
  homePageInIframe: false,
})
// const ms = createDiscreteApi(['message'])
const isSetHomePageUrl = ref(true)
const homePageUrl = ref('')

function ping(url: string, attempts: number, timeout: number): Promise<number> {
  let totalLatency = 0
  let successfulAttempts = 0

  const attemptPing = (): Promise<number> => {
    return new Promise((resolve, reject) => {
      const start = Date.now()

      const fetchPromise = fetch(url, { method: 'HEAD', mode: 'no-cors' })
        .then(() => {
          const end = Date.now()
          resolve(end - start)
        })
        .catch((err) => {
          reject(err)
        })

      const timeoutPromise = new Promise<number>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout),
      )

      Promise.race([fetchPromise, timeoutPromise])
        .then(latency => resolve(latency as number))
        .catch(err => reject(err))
    })
  }

  return new Promise((resolve, reject) => {
    const pingAttempt = (i: number) => {
      if (i < attempts) {
        attemptPing()
          .then((latency) => {
            totalLatency += latency
            successfulAttempts++
            pingAttempt(i + 1)
          })
          .catch(() => {
            // 失败的情况下继续尝试
            pingAttempt(i + 1)
          })
      }
      else {
        if (successfulAttempts > 0) {
          const averageLatency = totalLatency / successfulAttempts
          resolve(averageLatency)
        }
        else {
          reject(new Error('All ping attempts failed'))
        }
      }
    }

    pingAttempt(0)
  })
}

onMounted(async () => {
  statisticsPush()
  await storage.getItem<HomePageConfig>('local:homePageConfig').then((cfg) => {
    if (!cfg) {
      // ms.message.warning('请先配置首页地址')
      isSetHomePageUrl.value = false
      return
    }

    homePageConfig.value = cfg
  })

  if (!isSetHomePageUrl.value) {
    return
  }

  // 没有备用地址直接打开地址
  if (homePageConfig.value.spareUrl === '') {
    // browser.tabs.update({ url: homePageConfig.value.url })
    homePageUrl.value = homePageConfig.value.url
    if (!homePageConfig.value.homePageInIframe) {
      openToPage(homePageUrl.value)
    }
    return
  }

  // console.log(homePageConfig.value.url)
  await ping(homePageConfig.value.url, 2, 200).then(() => {
    homePageUrl.value = homePageConfig.value.url
    if (!homePageConfig.value.homePageInIframe) {
      openToPage(homePageUrl.value)
    }
    // ms.message.success(`${homePageConfig.value.url} - ${msv}`)
  }).catch((err) => {
    homePageUrl.value = homePageConfig.value.spareUrl
    if (!homePageConfig.value.homePageInIframe) {
      openToPage(homePageUrl.value)
    }
    console.error(err)
    // ms.message.warning(`主要地址无法平通${homePageConfig.url}`)
  })
})

function openToPage(url: string) {
  location.href = url
}

function handleGoSettingPage() {
  location.href = 'settings.html'
}
</script>

<template>
  <NConfigProvider :locale="language">
    <div class="background h-full" :style="{ backgroundImage: `url(${backgroundImg})` }">
      <!-- <div v-if="homePageUrl !== '' && homePageConfig.homePageInIframe"> -->
      <iframe
        v-if="homePageUrl !== '' && homePageConfig.homePageInIframe"
        id="iframe-sun-panel" class="fade-in-animation"
        :src="homePageUrl" frameborder="0"
        height="100%" width="100%"
      />
      <!-- </div> -->
      <div v-if="!isSetHomePageUrl">
        <div style="max-width: 80%;margin:50px auto">
          <NCard>
            <div class="flex justify-center">
              <NButton type="success" @click="handleGoSettingPage">
                {{ t("homePage.noSetHomePageUrl") }}
              </NButton>
            </div>
          </NCard>
        </div>
      </div>
    </div>
  </NConfigProvider>
</template>

<style scoped>
html ,body {
  overflow: hidden;
}

.background {
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fade-in-animation {
  animation: fadeIn 0.2s ease-in-out;
}
</style>
