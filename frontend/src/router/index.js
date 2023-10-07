import { createRouter, createWebHistory } from 'vue-router'
// Layouts
import UserLayout from '@/layouts/UserLayout.vue'
// Views
import LibraryView from '@/views/LibraryView.vue'

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
        path: 'library',
        name: 'Library',
        component: LibraryView
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
