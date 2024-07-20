import { computed, watch } from 'vue';
import { enUS, zhCN } from 'naive-ui';
import { useAppStore } from '@/store';

export function useLanguage() {
  const { locale } = useI18n(); // 使用 i18n 对象
  const appStore = useAppStore();

  const language = computed(() => {
    let langData;
    switch (appStore.language) {
      case 'en-US':
        langData = enUS;
        locale.value = 'en-US'; // 使用 locale.value 来更改语言
        break;
      case 'zh-CN':
        langData = zhCN;
        locale.value = 'zh-CN'; // 同上
        break;
      default:
        langData = zhCN;
        locale.value = 'zh-CN'; // 默认语言设置
    }
    return langData;
  });

  return { language };
}