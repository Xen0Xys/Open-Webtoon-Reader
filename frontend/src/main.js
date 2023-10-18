import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import { getCookie } from '@/assets/js/cookies'

axios.defaults.baseURL = 'http://146.19.168.113:5000/api/v1'
const token = getCookie('token')
if (token) axios.defaults.headers.common.Authorization = `Bearer ${token.value}`

createApp(App).use(store).use(router).mount('#app')
