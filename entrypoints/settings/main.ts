import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setupStore, useAppStore } from '@/store'

const app = createApp(App)

setupStore(app)

const appStore = useAppStore()
app.mount('#app')

appStore.initialize()
