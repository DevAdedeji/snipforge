import { onMounted, ref } from 'vue'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import type { Snippet } from '@/types/snippets'

export const useFetchSnippet = (snippetId: string) => {
  const toast = useToast()
  const loading = ref(false)
  const snippet = ref<Snippet | null>(null)
  const fetchSnippet = async () => {
    try {
      loading.value = true
      const docRef = doc(db, 'snippets', snippetId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        snippet.value = { id: docSnap.id, ...(docSnap.data() as Snippet) }
      } else {
        toast.add({ title: 'Error!', description: 'Snippet not found', color: 'error' })
      }
    } catch (error) {
      console.error('Error fetching snippet:', error)
      toast.add({ title: 'Error!', description: 'Error fetching snippet', color: 'error' })
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchSnippet()
  })

  return { loading, snippet }
}
