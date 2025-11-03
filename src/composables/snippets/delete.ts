import { ref } from 'vue'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'

export const useDeleteSnippet = () => {
  const toast = useToast()
  const loading = ref(false)
  const deleteSnippet = async (snippetId: string) => {
    if (!snippetId) {
      console.error('Delete snippet failed: No snippetId provided.')
      return
    }
    loading.value = true
    try {
      const docRef = doc(db, 'snippets', snippetId)
      await deleteDoc(docRef)
      toast.add({
        title: 'Success!',
        description: 'Snippet deleted successfully',
        color: 'success',
      })
    } catch (error) {
      console.error('Error deleting snippet:', error)
      toast.add({
        title: 'Error!',
        description: 'Could not delete snippet',
        color: 'error',
      })
    } finally {
      loading.value = false
    }
  }
  return { loading, deleteSnippet }
}
