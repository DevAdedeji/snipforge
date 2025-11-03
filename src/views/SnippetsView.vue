<template>
  <main class="w-full max-w-[1500px] mx-auto min-h-screen">
    <Header>
      <template #actions>
        <UButton
          color="primary"
          to="/create"
          class="text-text-primary-dark font-medium text-base"
          icon="i-heroicons-plus"
        >
          <span class="md:block hidden">Create Snippet</span>
        </UButton>
      </template>
    </Header>
    <div
      class="max-w-[90%] mx-auto flex flex-col gap-4 items-center justify-center h-[40vh] text-center"
    >
      <h1
        class="text-text-primary-dark text-4xl font-medium leading-tight tracking-[-0.033em] sm:text-5xl md:text-6xl"
      >
        {{ user?.displayName }}'s Snippets
      </h1>
      <UInput
        v-model="searchTerm"
        placeholder="Search for your snippet"
        size="xl"
        class="lg:w-[500px] w-[90%] mx-auto"
        icon="i-lucide-search"
        :ui="{ base: ['rounded-xl text-sm'] }"
      />
    </div>
    <div class="max-w-[90%] mx-auto py-8 px-4">
      <div v-if="loading" class="text-center text-gray-400">
        <p>Loading your snippets...</p>
      </div>
      <div v-else-if="!filteredSnippets.length" class="text-center text-gray-400">
        <p v-if="searchTerm">No snippets found matching "{{ searchTerm }}".</p>
        <p v-else>You haven't created any snippets yet.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SnippetCard
          v-for="snippet in filteredSnippets"
          :key="snippet.id"
          :snippet="snippet"
          @deleted="refreshSnippets"
          :public="false"
          @updated="refreshSnippets"
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from '@/components/layout/AppHeader.vue'
import SnippetCard from '@/components/SnippetCard.vue'
import { useAuth } from '@/composables/auth'
import { useFetchUserSnippets } from '@/composables/snippets/fetch'

const { user } = useAuth()
const { snippets, loading, fetchUserSnippets } = useFetchUserSnippets()

const searchTerm = ref('')

const filteredSnippets = computed(() => {
  if (!searchTerm.value) {
    return snippets.value
  }

  const lowerCaseSearch = searchTerm.value.toLowerCase()
  return snippets.value.filter((snippet) => {
    return (
      snippet.title.toLowerCase().includes(lowerCaseSearch) ||
      snippet.description.toLowerCase().includes(lowerCaseSearch)
    )
  })
})

const refreshSnippets = () => {
  fetchUserSnippets(false)
}
</script>
