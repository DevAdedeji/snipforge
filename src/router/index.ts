import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        guestOnly: true,
      },
    },
  ],
})

let authResolved = false

function waitForAuth() {
  return new Promise((resolve) => {
    if (authResolved) return resolve(auth.currentUser)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      authResolved = true
      unsubscribe()
      resolve(user)
    })
  })
}

router.beforeEach(async (to, from, next) => {
  const user = await waitForAuth()
  if (to.meta.requiresAuth && !user) next('/login')
  else if (to.meta.guestOnly && user) next('/')
  else next()
})

export default router
