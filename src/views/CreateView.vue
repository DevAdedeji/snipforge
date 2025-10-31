<template>
  <main class="w-full max-w-[1500px] mx-auto min-h-screen flex flex-col gap-6 pb-10">
    <header>
      <nav class="px-4 md:px-8 py-3 flex items-center justify-between border-b border-card-dark">
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
          <!-- <UButton
            color="neutral"
            variant="outline"
            class="bg-card-dark! text-text-primary-dark font-medium text-sm min-w-[84px] max-w-[480px]"
            icon="i-heroicons-share"
            >
            Share
            </UButton
          > -->
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
            <div>
              <div v-if="output.error" class="text-red-400 font-mono text-sm whitespace-pre-wrap">
                {{ output.error }}
              </div>
              <div
                v-else-if="output.content"
                class="text-green-400 font-mono text-sm whitespace-pre-wrap"
              >
                {{ output.content }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <h3>AI Actions</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <UButton
              color="neutral"
              variant="outline"
              class="bg-card-dark! text-text-primary-dark font-medium text-sm min-w-[84px] max-w-[480px]"
            >
              <UIcon name="i-heroicons-sparkles" class="text-primary" />
              Explain
            </UButton>
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
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CodeEditor from '@/components/CodeEditor.vue'
import { shouldDetectLanguage, detectLanguage } from '@/utils/languageDetector'
import { runPythonCode } from '@/utils/pythonRunner'
import { runJavaScriptCode, runTypeScriptCode } from '@/utils/jsRunner'
import { useSaveSnippet } from '@/composables/snippets/save'
import type { Snippet } from '@/types/snippets'

const router = useRouter()

const snippetDetails = ref<Partial<Snippet>>({
  title: 'Untitle Snippet',
  description: '',
  private: true,
  tags: [],
})
const { loading, saveSnippet } = useSaveSnippet()

const handleSaveSnippet = () => {
  const payload: Omit<Snippet, 'userId'> = {
    title: snippetDetails.value.title ?? 'Untitled Snippet',
    description: snippetDetails.value.description ?? '',
    tags: snippetDetails.value.tags ?? [],
    private: snippetDetails.value.private ?? true,
    code: code.value,
    language: language.value,
  }
  saveSnippet(payload)
}

const language = ref<'javascript' | 'typescript' | 'python'>('python')
const code = ref(`
def greet(name):
    print(f"Hello, {name}!")

greet("World")

# Simple loop
for i in range(3):
    print(i)
`)

const output = ref<{ content: string; error: string | null }>({
  content: '',
  error: null,
})

const isRunning = ref(false)

async function runCode() {
  isRunning.value = true
  output.value = { content: '', error: null }

  try {
    if (language.value === 'python') {
      const result = await runPythonCode(code.value)
      output.value = { content: result.output, error: result.error }
    } else if (language.value === 'javascript') {
      const result = runJavaScriptCode(code.value)
      output.value = { content: result.output, error: result.error }
    } else if (language.value === 'typescript') {
      const result = runTypeScriptCode(code.value)
      output.value = { content: result.output, error: result.error }
    }
  } catch (error: unknown) {
    let errMsg: string | null = null
    if (error instanceof Error) {
      errMsg = error.message
    } else if (typeof error === 'string') {
      errMsg = error
    } else {
      try {
        errMsg = JSON.stringify(error)
      } catch {
        errMsg = String(error)
      }
    }
    output.value = { content: '', error: errMsg }
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
</script>
