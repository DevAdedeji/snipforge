import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import CreateView from '@/views/CreateView.vue'
import SnippetView from '@/views/SnippetView.vue'
import SnippetsView from '@/views/SnippetsView.vue'
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
        requiresAuth: false,
      },
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
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
    {
      path: '/snippets',
      name: 'snippets',
      component: SnippetsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/snippet/:id',
      name: 'snippet',
      component: SnippetView,
      props: true,
      meta: {
        requiresAuth: false,
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
