<template>
  <UModal
    v-model:open="open"
    title="Improve Snippet"
    aria-describedby="improve-snippet"
    :ui="{ content: 'w-[1000px]! max-w-full!' }"
  >
    <UButton
      color="neutral"
      variant="outline"
      class="bg-card-dark! text-text-primary-dark font-medium text-sm min-w-[84px] max-w-[480px]"
    >
      <UIcon name="i-heroicons-rocket-launch" class="text-green-500" />
      Improve
    </UButton>
    <template #body>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="flex flex-col gap-1 h-full w-full overflow-hidden">
          <p class="text-sm">{{ title }}</p>
          <div class="relative sm:h-[55vh] sm:max-h-[55vh] overflow-y-auto rounded-md bg-[#0d1117]">
            <pre
              class="h-full w-full p-2"
            ><code class="text-sm hljs" v-html="highlightedCode"></code></pre>
          </div>
        </div>
        <div class="flex flex-col gap-1 h-full w-full overflow-hidden">
          <p class="text-sm">Improved Snippet</p>
          <div class="relative sm:h-[55vh] sm:max-h-[55vh] overflow-y-auto">
            <div v-if="running" class="flex flex-col gap-2">
              <USkeleton class="h-8 w-full" />
              <USkeleton class="h-8 w-full" />
              <USkeleton class="h-8 w-[80%]" />
              <USkeleton class="h-8 w-full" />
              <USkeleton class="h-8 w-[60%]" />
              <USkeleton class="h-8 w-full" />
              <USkeleton class="h-8 w-full" />
              <USkeleton class="h-8 w-[60%]" />
              <USkeleton class="h-8 w-full" />
            </div>
            <div
              v-else
              class="markdown-viewer prose prose-invert prose-sm max-w-none text-sm text-text-secondary-dark"
              v-html="renderMarkdown(explanation)"
            ></div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex items-center gap-2 justify-end">
        <UButton
          v-if="explanation.length"
          class="text-sm text-text-primary-dark"
          @click="copy(explanation)"
        >
          Copy Improved Snippet
        </UButton>
        <UButton
          role="button"
          class="bg-card-dark! h-9 text-text-primary-dark font-medium text-sm min-w-[84px] max-w-[480px]"
          @click.stop="runImproveCode"
        >
          <UIcon name="i-heroicons-arrow-path" />
          Regenerate
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { improveCode } from '@/services/gemini'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useToast } from '@nuxt/ui/runtime/composables/useToast.js'
import { renderMarkdown } from '@/utils/markdown'
import { useClipboard } from '@/composables/utils/clipboard'

const { copy } = useClipboard()
const open = ref(false)

const props = defineProps<{
  code: string
  language: string
  title: string
}>()

const codePreview = computed(() => {
  if (!props.code) return ''
  return props.code
})

const highlightedCode = computed(() => {
  const lang = props.language.toLowerCase()
  if (hljs.getLanguage(lang)) {
    return hljs.highlight(codePreview.value, {
      language: lang,
    }).value
  }
  return hljs.highlightAuto(codePreview.value).value
})

const running = ref(false)
const explanation = ref('')
const runImproveCode = async () => {
  try {
    running.value = true
    const response = await improveCode(props.code, props.language)
    explanation.value = response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    useToast().add({
      title: 'Error',
      description: error.message || error || 'Something went wrong, pls try again',
    })
  } finally {
    running.value = false
  }
}

watch(open, () => {
  runImproveCode()
})
</script>
