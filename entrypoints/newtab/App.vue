<script lang="ts" setup>
import { NButton, NCard } from 'naive-ui'
import backgroundImg from '@/assets/defaultBackground.webp'
import { useLanguage } from '@/hooks/useLanguage'

const { t } = useI18n()

const { language } = useLanguage()

console.log(backgroundImg)
interface HomePageConfig {
  url: string
  spareUrl: string
}

// const ms = createDiscreteApi(['message'])
const isSetHomePageUrl = ref(true)

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
  let homePageConfig: HomePageConfig = {
    url: '',
    spareUrl: '',
  }

  // console.log(666)
  await storage.getItem<HomePageConfig>('local:homePageConfig').then((cfg) => {
    if (!cfg) {
      // ms.message.warning('请先配置首页地址')
      isSetHomePageUrl.value = false
      return
    }

    homePageConfig = cfg
  })

  if (!isSetHomePageUrl.value) {
    return
  }

  // 没有备用地址直接打开地址
  if (homePageConfig.spareUrl === '') {
    location.href = homePageConfig.url
    return
  }

  // console.log(homePageConfig.url)
  await ping(homePageConfig.url, 2, 200).then(() => {
    location.href = homePageConfig.url
    // ms.message.success(`${homePageConfig.url} - ${msv}`)
  }).catch((err) => {
    location.href = homePageConfig.spareUrl
    console.error(err)
    // ms.message.warning(`主要地址无法平通${homePageConfig.url}`)
  })
})

function handleGoSettingPage() {
  location.href = 'settings.html'
}
</script>

<template>
  <NConfigProvider
    :locale="language"
  >
    <div class="background" :style="{ backgroundImage: `url(${backgroundImg})` }">
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
.html body{
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
</style>
