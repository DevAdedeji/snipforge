import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase'
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'

const user = ref<User | null>(null)

export function useAuth() {
  const router = useRouter()
  onAuthStateChanged(auth, (u) => {
    user.value = u
  })

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    router.push('/')
  }

  const loginWithGithub = async () => {
    const provider = new GithubAuthProvider()
    await signInWithPopup(auth, provider)
    router.push('/')
  }

  const logout = async () => {
    await signOut(auth)
router.push('/login')
  }

  return {
    user,
    loginWithGoogle,
    loginWithGithub,
    logout,
  }
}
