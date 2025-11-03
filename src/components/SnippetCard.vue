<template>
  <div
    class="bg-surface-dark rounded-lg border border-[#334155] p-4 flex flex-col hover:border-primary/70 transition-colors group cursor-pointer"
    @click="goToSnippetPage"
  >
    <div class="flex justify-between items-start mb-3">
      <h3 class="font-bold text-text-primary-dark">{{ snippet.title }}</h3>
      <div class="capitalize text-xs font-mono bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
        {{ snippet.language }}
      </div>
    </div>
    <div class="relative h-32 w-full overflow-hidden rounded-md bg-[#0d1117] mb-4">
      <pre
        class="h-full w-full p-2"
      ><code class="text-sm hljs" v-html="highlightedCode"></code></pre>
      <div
        class="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-surface-dark to-transparent pointer-events-none"
      ></div>
    </div>
    <div class="mt-auto flex justify-between items-center">
      <div class="flex gap-2">
        <span
          v-for="(tag, index) in snippet.tags"
          :key="index"
          class="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
          >{{ tag }}</span
        >
      </div>
      <div class="flex items-center gap-2 text-text-secondary-dark">
        <button v-if="!public" class="p-1 rounded hover:bg-white/10" @click.stop="updateSnippetFavourite">
          <UIcon :name="updating ? 'i-heroicons-arrow-path' : snippet.favourite ? 'i-heroicons-star-solid' : 'i-heroicons-star'" :class="updating ? 'animate-spin' : ''" />
        </button>
        <button class="p-1 rounded hover:bg-white/10" @click.stop="shareSnippet" >
          <UIcon name="i-heroicons-share" />
        </button>
        <button
          v-if="!public"
          class="p-1 rounded hover:bg-red-400 text-red-600"
          @click.stop="handleDelete"
        >
          <UIcon
            :name="deleteLoading ? 'i-heroicons-arrow-path' : 'i-heroicons-trash'"
            :class="deleteLoading ? 'animate-spin' : ''"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDeleteSnippet } from '@/composables/snippets/delete'
import { useUpdateSnippet } from "@/composables/snippets/update"
import type { Snippet } from '@/types/snippets'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useClipboard } from '@/composables/utils/clipboard'

const { copy } = useClipboard()
const { loading: deleteLoading, deleteSnippet } = useDeleteSnippet()
const { loading: updating, updateSnippet } = useUpdateSnippet()
const router = useRouter()

const emit = defineEmits(['deleted', 'updated'])
const props = defineProps<{
  snippet: Snippet
  public: boolean
}>()

const codePreview = computed(() => {
  if (!props.snippet.code) return ''
  return props.snippet.code.split('\n').slice(0, 7).join('\n')
})

const highlightedCode = computed(() => {
  const lang = props.snippet.language.toLowerCase()
  if (hljs.getLanguage(lang)) {
    return hljs.highlight(codePreview.value, {
      language: lang,
    }).value
  }
  return hljs.highlightAuto(codePreview.value).value
})

const goToSnippetPage = () => {
  router.push(`/snippet/${props.snippet.id}`)
}

const handleDelete = async () => {
  if (props.snippet && props.snippet.id) {
    await deleteSnippet(props.snippet.id)
    emit('deleted')
  }
}

const updateSnippetFavourite = async () => {
  if(props.snippet && props.snippet.id) {
    const data = {
    ...props.snippet,
    favourite: !props.snippet.favourite
  }
  updateSnippet(props.snippet.id, data)
  emit('updated')
  }
}

const shareSnippet = () => {
  const url = import.meta.env.VITE_APP_URL + `/snippet/${props.snippet.id}`
  copy(url)
}
</script>
