import { createRouter, createWebHistory } from 'vue-router'
// Layouts
import UserLayout from '@/layouts/UserLayout.vue'
// Views
import LibraryView from '@/views/LibraryView.vue'
import WebtoonHomePage from '@/views/WebtoonHomePage.vue'
import WebtoonEpisodeReader from '@/views/WebtoonEpisodeReader.vue'

const routes = [
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: '',
        name: 'Home',
        redirect: '/library'
      },
      {
        path: 'library/',
        name: 'Library',
        component: LibraryView
      },
      {
        path: 'webtoon/:webtoon',
        name: 'WebToon',
        component: WebtoonHomePage
      },
      {
        path: 'episode/:webtoon/:episode',
        name: 'Episode',
        component: WebtoonEpisodeReader
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const titleBase = 'OWR |'
router.beforeEach((to, from, next) => {
  window.scrollTo({ top: 0 })
  document.title = `${titleBase} ${to.meta?.title || 'Welcome'}`
  next()
})

export default router
