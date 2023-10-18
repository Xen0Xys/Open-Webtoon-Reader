import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/assets/js/authentication'
// Layouts
import UserLayout from '@/layouts/UserLayout.vue'
// Views
import LibraryView from '@/views/LibraryView.vue'
import WebtoonHomePage from '@/views/WebtoonHomePage.vue'
import WebtoonEpisodeReader from '@/views/WebtoonEpisodeReader.vue'
import LoginView from '@/views/auth/LoginView.vue'

const routes = [
  {
    path: '/',
    component: UserLayout,
    meta: {
      needAuthentication: true
    },
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
  },
  {
    path: '/auth/login',
    component: LoginView,
    meta: {
      redirectIfConnected: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const titleBase = 'OWR |'
router.beforeEach(async (to, from, next) => {
  const auth = isAuthenticated()
  if (to.meta?.needAuthentication && !auth) return router.push('/auth/login')
  if (to.meta?.redirectIfConnected && auth) return router.push('/')

  window.scrollTo({ top: 0 })
  document.title = `${titleBase} ${to.meta?.title || 'Welcome'}`
  next()
})

export default router
