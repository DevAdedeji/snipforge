<template>
  <main class="w-full max-w-[1500px] mx-auto min-h-screen flex flex-col gap-6 pb-10">
    <div v-if="fetching" class="w-full h-screen flex items-center justify-center text-center">
      <p class="text-xl md:text-2xl font-medium text-text-primary-dark">
        Fetching Snippet Details...
      </p>
    </div>
    <div v-else class="w-full flex flex-col gap-6">
      <header>
        <nav
          class="px-4 md:px-8 py-3 flex items-center gap-2 justify-between border-b border-card-dark"
        >
          <button
            class="flex items-center gap-2 font-medium text-text-secondary-dark hover:text-text-primary-dark transition-colors text-xl"
            @click="router.back()"
          >
            <UIcon name="i-heroicons-arrow-left" />
            <span class="hidden md:block">Back</span>
          </button>
          <UInput placeholder="Untitled Snippet" v-model="snippetDetails.title" />
          <div class="flex items-center gap-2">
            <UButton
              color="primary"
              class="text-text-primary-dark font-medium text-sm md:min-w-[84px] md:max-w-[480px]"
              :disabled="loading"
              :loading="loading"
              @click="handleSaveSnippet"
              icon="i-lucide-save"
            >
              <span class="hidden md:block">Save</span>
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              class="bg-card-dark! text-text-primary-dark font-medium text-sm md:min-w-[84px] md:max-w-[480px]"
              icon="i-heroicons-share"
            >
              <span class="hidden md:block">Share</span>
            </UButton>
          </div>
        </nav>
      </header>
      <div class="px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-card-dark border border-[#334155] overflow-hidden rounded-xl">
          <div class="px-4 flex flex-col gap-2 pb-4 h-[60vh] md:h-[85vh]">
            <div class="py-3 border-b border-[#334155] flex items-center justify-between shrink-0">
              <UButton
                color="neutral"
                variant="outline"
                class="rounded-md border-none bg-[#334155]/50 text-text-primary-dark text-sm px-3 min-w-[84px] max-w-[480px] capitalize"
              >
                {{ language }}
              </UButton>
              <UButton
                color="primary"
                class="text-text-primary-dark font-medium text-sm md:min-w-[84px] md:max-w-[480px]"
                @click="runCode"
                :loading="isRunning"
                :disabled="isRunning"
              >
                <UIcon v-if="!isRunning" name="i-heroicons-play" />
                <p class="hidden sm:block">{{ isRunning ? 'Running...' : 'Run Code' }}</p>
              </UButton>
            </div>
            <div class="flex-1 min-h-0">
              <CodeEditor v-model="code" v-model:language="language" />
            </div>
          </div>
        </div>
        <div class="md:w-[90%] md:ml-auto flex flex-col gap-6">
          <div
            class="w-full bg-card-dark border border-[#334155] overflow-hidden rounded-xl h-[50vh] max-h-[50vh]"
          >
            <div class="h-full overflow-y-auto relative px-4 flex flex-col gap-2">
              <div
                class="sticky border-b border-[#334155] py-4 top-0 left-0 right-0 flex items-center justify-between bg-card-dark"
              >
                <h3>Output</h3>
                <button @click="clearOutput">
                  <UIcon name="i-heroicons-trash" />
                </button>
              </div>
              <div class="py-4">
                <div v-if="output.error" class="text-red-400 font-mono text-sm whitespace-pre-wrap">
                  {{ output.error }}
                </div>
                <div
                  v-else-if="output.content"
                  class="font-mono text-sm whitespace-pre-wrap text-gray-300"
                >
                  {{ output.content }}
                </div>
                <div v-else class="text-gray-500 italic">Click 'Run Code' to see the output.</div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <h3>AI Actions</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <ExplainCodeModal
                :code="code"
                :language="language"
                :title="snippetDetails.title || ''"
              />
              <UButton
                color="neutral"
                variant="outline"
                class="bg-card-dark! text-text-primary-dark font-medium text-sm min-w-[84px] max-w-[480px]"
              >
                <UIcon name="i-heroicons-rocket-launch" class="text-green-500" />
                Improve
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                class="bg-card-dark! text-text-primary-dark font-medium text-sm min-w-[84px] max-w-[480px]"
              >
                <UIcon name="i-heroicons-beaker" class="text-primary" />
                Tests
              </UButton>
            </div>
          </div>
          <div class="w-full flex flex-col gap-2">
            <label for="description">Description:</label>
            <UTextarea class="w-full" name="description" v-model="snippetDetails.description" />
          </div>
          <div class="flex items-center justify-between">
            <label for="private">Private:</label>
            <USwitch name="private" v-model="snippetDetails.private" />
          </div>
          <div class="w-full flex flex-col gap-2">
            <label for="tags">Tags:</label>
            <UInputTags name="tags" v-model="snippetDetails.tags" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { shouldDetectLanguage, detectLanguage } from '@/utils/languageDetector'
import { runPythonCode } from '@/utils/pythonRunner'
import { runJavaScriptCode, runTypeScriptCode } from '@/utils/jsRunner'
import { runCodeWithPiston, shouldUsePiston } from '@/utils/pistonRunner'
import { useFetchSnippet } from '@/composables/snippets/fetch'
import { useUpdateSnippet } from '@/composables/snippets/update'
import type { Snippet, SupportedLanguage } from '@/types/snippets'
import CodeEditor from '@/components/CodeEditor.vue'
import ExplainCodeModal from '@/components/ExplainCodeModal.vue'

const route = useRoute()
const router = useRouter()
const snippetId = route.params.id as string

const snippetDetails = ref<Partial<Snippet>>({
  title: 'Untitle Snippet',
  description: '',
  private: true,
  tags: [],
})
const { loading, updateSnippet } = useUpdateSnippet()

const language = ref<SupportedLanguage>('python')
const code = ref(`
def greet(name):
    print(f"Hello, {name}!")

greet("World")

# Simple loop
for i in range(3):
    print(i)
`)

const handleSaveSnippet = () => {
  const payload: Omit<Snippet, 'userId'> = {
    title: snippetDetails.value.title ?? 'Untitled Snippet',
    description: snippetDetails.value.description ?? '',
    tags: snippetDetails.value.tags ?? [],
    private: snippetDetails.value.private ?? true,
    code: code.value,
    language: language.value,
  }
  updateSnippet(snippetId, payload)
}

const output = ref<{ content: string; error: string | null }>({
  content: '',
  error: null,
})

const isRunning = ref(false)

async function runCode() {
  isRunning.value = true
  output.value = { content: '', error: null }

  try {
    let result

    if (shouldUsePiston(language.value)) {
      result = await runCodeWithPiston(code.value, language.value)
    } else if (language.value === 'python') {
      result = await runPythonCode(code.value)
    } else if (language.value === 'typescript') {
      result = runTypeScriptCode(code.value)
    } else if (language.value === 'javascript') {
      result = runJavaScriptCode(code.value)
    } else {
      result = { output: '', error: 'Unsupported language' }
    }

    output.value = { content: result.output, error: result.error }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    output.value = { content: '', error: error.message }
  } finally {
    isRunning.value = false
  }
}

function clearOutput() {
  output.value = { content: '', error: null }
}

watch(code, (newCode, oldCode) => {
  if (shouldDetectLanguage(newCode, oldCode || '')) {
    const detectedLang = detectLanguage(newCode)
    if (detectedLang !== language.value) {
      console.log('Language auto-detected:', detectedLang)
      language.value = detectedLang
    }
  }
})

const { loading: fetching, snippet } = useFetchSnippet(snippetId)

watch(
  snippet,
  () => {
    if (snippet.value) {
      snippetDetails.value = {
        title: snippet.value?.title,
        description: snippet.value?.description,
        private: snippet.value?.private,
        tags: snippet.value.tags.length ? snippet.value.tags : [],
      }
      code.value = snippet.value?.code
      language.value = snippet.value?.language
    }
  },
  { immediate: true },
)
</script>
