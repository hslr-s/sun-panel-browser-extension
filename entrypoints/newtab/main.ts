import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupStore, useAppStore } from '@/store'
import i18n from '@/util/i18n'

const app = createApp(App)
setupStore(app)
app.use(i18n)
const appStore = useAppStore()
appStore.initialize()
app.mount('#app')
