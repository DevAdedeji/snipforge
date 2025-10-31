import { ref } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import type { Snippet } from '@/types/snippets'

type UpdatableSnippetData = Omit<Snippet, 'userId'>

export const useUpdateSnippet = () => {
  const loading = ref(false)
  const toast = useToast()

  const updateSnippet = async (snippetId: string, snippetData: UpdatableSnippetData) => {
    try {
      loading.value = true

      const snippetRef = doc(db, 'snippets', snippetId)
      await updateDoc(snippetRef, {
        ...snippetData
      })
      toast.add({ title: 'Success!', description: 'Snippet updated' })
    } catch (e: unknown) {
      console.error('Error updating snippet:', e)
      toast.add({ title: 'Error updating snippet', color: 'error' })
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    updateSnippet,
  }
}