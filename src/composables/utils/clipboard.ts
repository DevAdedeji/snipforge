/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed } from 'vue'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'

export function useClipboard() {
  const isSupported = computed(() => navigator && 'clipboard' in navigator)
  const toast = useToast()

  const copy = async (text: string) => {
    if (!isSupported.value) {
      toast.add({
        title: 'Error',
        description: 'Clipboard API is not supported in this browser.',
        color: 'error',
      })
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      toast.add({ title: 'Success', description: 'Copied to clipboard', color: 'success' })
    } catch (_: unknown) {
      toast.add({ title: 'Error', description: 'Failed to copy', color: 'error' })
    }
  }

  return {
    copy,
  }
}
