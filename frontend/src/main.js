import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'

axios.defaults.baseURL = 'http://146.19.168.113:5000/api/v1'
axios.defaults.headers.common.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5Njc4NjM3MiwiZXhwIjoxNjk5Mzc4MzcyfQ.KoAamx0DONCWhlNhm40rFbhSjkizc_U7hC5Kppt1x1g'

createApp(App).use(store).use(router).mount('#app')
