<template>
  <div style="height: 100vh; width: 100%">
    <CodeEditor
      v-model:value="code"
      :language="language"
      :theme="editorTheme"
      :automaticLayout="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineModel } from 'vue'
import { CodeEditor, type SupportedLanguage } from 'monaco-editor-vue3'
import * as monacoEditor from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}

const code = defineModel({ required: true, type: String })
const language = defineModel('language', {
  required: true,
  type: String as () => SupportedLanguage,
})

const editorTheme = ref('myCustomTheme')

onMounted(() => {
  monacoEditor.editor.defineTheme('myCustomTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1e293b',
      'editor.lineHighlightBorder': '#334155',
    },
  })
})
</script>
