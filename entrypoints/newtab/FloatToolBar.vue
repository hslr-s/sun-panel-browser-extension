<script setup lang="ts">
import { ref, watch } from 'vue'
import { NButton, NFlex, NImage, NTooltip } from 'naive-ui'
import { InformationCircleOutline, OpenOutline, Refresh, SettingsSharp as SettingsIcon } from '@vicons/ionicons5'

// 添加: 定义 currentUrl prop
const props = defineProps<{
  currentUrl: string
  homePageConfig: BaseType.HomePageConfig
}>()

const { t } = useI18n()

const urlStatusToolTipShow = ref(false)
const urlStatusToolTipMsg = ref('')
const infoTipText = ref('By [Sun-Panel BE]')

// 添加: 监听 currentUrl 变化
watch(
  () => props.currentUrl,
  (newUrl) => {
    init(newUrl)
    console.log('currentUrl changed to:', newUrl)
    // 在这里可以添加其他逻辑来处理 currentUrl 的变化
  },
)

// 添加: 控制 div 的宽度
const divWidth = ref('30px')

// 添加: 控制 div 的展开状态
const isExpanded = ref(false)

// 添加: 控制 tooltip 的手动显示和隐藏
const tooltipManualShow = ref(false)

function init(newUrl: string) {
  if (props.homePageConfig.spareUrl !== '' && props.homePageConfig.url !== '') {
    if (props.homePageConfig.spareUrl === newUrl) {
      updateStatusToolTip(true, t('homePage.currentSpareUrlAddress'))
    }
    if (props.homePageConfig.url === newUrl) {
      updateStatusToolTip(true, t('homePage.currentUrlAddress'))
    }
  }
  setTimeout(() => {
    updateStatusToolTip(false)
  }, 3000)
  console.log('currentUrl changed to:', newUrl)
}

function updateStatusToolTip(status: boolean, msg?: string) {
  if (msg) {
    urlStatusToolTipMsg.value = msg
  }
  urlStatusToolTipShow.value = status
}

// 添加: 点击事件来控制 div 的展开和收起
function toggleExpand() {
  isExpanded.value = !isExpanded.value
  divWidth.value = isExpanded.value ? '200px' : '30px'
}

// 添加: 处理 tooltip 的手动显示和隐藏
function handleSwitchTooltipShow(event: MouseEvent) {
  event.stopPropagation()
  console.log('切换显示按钮', '当前状态', tooltipManualShow.value)
  tooltipManualShow.value = !tooltipManualShow.value
}

function handleSetting() {
  browser.tabs.create({ url: 'settings.html' })
}

function handleNewTabOpen() {
  browser.tabs.create({ url: props.currentUrl })
}

function handleReload() {
  browser.tabs.reload()
}
// function handleTooltipShow() {
//   tooltipManualShow.value = true
// }
// function handleTooltipHide() {
//   tooltipManualShow.value = false
// }

onMounted(() => {
  init(props.currentUrl)
  setTimeout(() => {
    updateStatusToolTip(false)
  }, 3000)
})
</script>

<template>
  <div
    class="float-toolbar flex" :style="{ width: divWidth, height: '30px', transition: 'width 0.3s' }"
    @click="toggleExpand"
  >
    <div style="width: 30px; height: 30px;">
      <NTooltip :show="urlStatusToolTipShow" placement="right">
        <template #trigger>
          <NTooltip :show="tooltipManualShow" placement="right" :show-arrow="false">
            <template #trigger>
              <NImage
                v-if="!isExpanded" class="cursor-pointer" src="/images/logo.png" preview-disabled
                :title="`${urlStatusToolTipMsg}(${currentUrl})`" @click="handleSwitchTooltipShow"
              />
            </template>
            <NFlex align="center">
              <NButton size="tiny" type="primary" ghost @click="handleReload">
                <template #icon>
                  <Refresh />
                </template>
              </NButton>
              <NButton size="tiny" type="primary" ghost @click="handleNewTabOpen">
                <template #icon>
                  <OpenOutline />
                </template>
              </NButton>
              <NButton size="tiny" type="primary" ghost @click="handleSetting">
                <template #icon>
                  <SettingsIcon />
                </template>
              </NButton>

              <div>
                <span> {{ urlStatusToolTipMsg }}</span>
              </div>

              <div class="w-[15px] h-[15px]" :title="infoTipText">
                <InformationCircleOutline />
              </div>
            </NFlex>
          </NTooltip>
        </template>
        <div class="flex items-center">
          <span> {{ urlStatusToolTipMsg }}</span>

          <div class="w-[15px] h-[15px] ml-1" :title="infoTipText">
            <InformationCircleOutline />
          </div>
        </div>
      </NTooltip>
    </div>
  </div>
</template>

<style scoped>
.float-toolbar {
  position: fixed;
  bottom: 20px;
  left: 20px;
}
</style>
