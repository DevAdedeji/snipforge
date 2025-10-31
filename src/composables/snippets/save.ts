import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { auth } from '@/firebase'
import type { Snippet } from '@/types/snippets'
import { useRouter } from 'vue-router'

export const useSaveSnippet = () => {
  const loading = ref(false)
  const toast = useToast()
  const router = useRouter()
  const user = auth.currentUser
  const saveSnippet = async (snippetData: Omit<Snippet, 'userId'>) => {
    if (!user) {
      toast.add({
        title: 'Authentication Error',
        description: 'You must be logged in to save.',
        color: 'error',
      })
      return
    }
    try {
      loading.value = true
      const snippetToSave: Omit<Snippet, 'id'> = {
        ...snippetData,
        userId: user.uid,
      }
      const snippetCollection = collection(db, 'snippets')
      const snippetDoc = await addDoc(snippetCollection, snippetToSave)
      toast.add({ title: 'Success!', description: 'Snippet saved' })
      router.push(`/snippet/${snippetDoc.id}`)
    } catch (e: unknown) {
      console.log(e)
      toast.add({ title: 'Error saving snippet', color: 'error' })
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    saveSnippet,
  }
}
