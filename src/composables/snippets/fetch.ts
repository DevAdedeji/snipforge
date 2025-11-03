import { onMounted, ref, watch, computed } from 'vue'
import { getDoc, doc, collection, where, query, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import type { Snippet } from '@/types/snippets'
import { useAuth } from '@/composables/auth'
import { useRouter } from "vue-router"

export const useFetchPublicSnippets = () => {
  const toast = useToast()
  const loading = ref(false)
  const snippets = ref<Snippet[]>([])
  const fetchPublicSnippets = async () => {
    loading.value = true
    try {
      const snippetsColRef = collection(db, 'snippets')
      const q = query(snippetsColRef, where('private', '==', false))
      const querySnapshot = await getDocs(q)
      snippets.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Snippet, 'id'>),
      }))
    } catch (error) {
      console.error('Error fetching user snippets:', error)
      toast.add({ title: 'Error!', description: 'Error fetching snippets', color: 'error' })
    } finally {
      loading.value = false
    }
  }
  onMounted(() => {
    fetchPublicSnippets()
  })

  return { loading, snippets, fetchPublicSnippets }
}

export const useFetchUserSnippets = () => {
  const toast = useToast()
  const loading = ref(false)
  const snippets = ref<Snippet[]>([])
  const { user } = useAuth()
  const userId = computed(() => user.value?.uid)
  const fetchUserSnippets = async (load: boolean = true) => {
    const currentUserId = userId.value
    if (!currentUserId) {
      snippets.value = []
      return
    }
    if(load) loading.value = true
    try {
      const snippetsColRef = collection(db, 'snippets')
      const q = query(snippetsColRef, where('userId', '==', currentUserId), orderBy('favourite', 'desc'))
      const querySnapshot = await getDocs(q)
      snippets.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Snippet, 'id'>),
      }))
    } catch (error) {
      console.error('Error fetching user snippets:', error)
      toast.add({ title: 'Error!', description: 'Error fetching snippets', color: 'error' })
    } finally {
      loading.value = false
    }
  }
  watch(
    userId,
    (newId) => {
      if (newId) {
        fetchUserSnippets()
      } else {
        snippets.value = []
      }
    },
    { immediate: true },
  )

  return { loading, snippets, fetchUserSnippets }
}

export const useFetchSnippet = (snippetId: string) => {
  const toast = useToast()
  const loading = ref(false)
  const snippet = ref<Snippet | null>(null)
  const { user } = useAuth()
  const userId = computed(() => user.value?.uid)
  const router = useRouter()
  const fetchSnippet = async () => {
    const currentUserId = userId.value
    try {
      loading.value = true
      const docRef = doc(db, 'snippets', snippetId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const snippetData = { id: docSnap.id, ...(docSnap.data() as Snippet) }
        if ( snippetData.private === false || (snippetData.private === true && snippetData.userId === currentUserId) ) {
          snippet.value = snippetData
        } else if ( snippetData.private === true && snippetData.userId !== currentUserId ) {
          snippet.value = null
          toast.add({ title: 'Error!', description: 'Unauthorized access', color: 'error' })
          useRouter().push('/')
        }
      } else {
        toast.add({ title: 'Error!', description: 'Snippet not found', color: 'error' })
      }
    } catch (error) {
      console.error('Error fetching snippet:', error)
      toast.add({ title: 'Error!', description: 'Error fetching snippet', color: 'error' })
      router.push('/')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchSnippet()
  })

  return { loading, snippet }
}
