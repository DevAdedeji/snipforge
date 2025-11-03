<template>
  <main class="w-full max-w-[1500px] mx-auto min-h-screen">
    <Header />
    <div
      class="max-w-[90%] mx-auto flex flex-col gap-4 items-center justify-center h-[60vh] text-center"
    >
      <h1
        class="text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl md:text-6xl"
      >
        Discover &amp; Share Code Snippets
      </h1>
      <p class="text-text-secondary-dark text-base font-normal leading-normal mx-auto sm:text-lg">
        The ultimate vault for developers. Explore a world of elegant solutions and contribute your
        own.
      </p>
      <div class="flex items-center gap-2">
        <UButton
          color="primary"
          to="/snippets"
          class="mt-4 text-text-primary-dark font-medium text-base"
          >Explore Snippets</UButton
        >
        <UButton
          color="primary"
          to="/create"
          class="mt-4 text-text-primary-dark font-medium text-base"
          >Get Started</UButton
        >
      </div>
    </div>
    <div class="max-w-[90%] mx-auto py-8 px-4">
      <div v-if="loading" class="text-center text-gray-400">
        <p>Loading your snippets...</p>
      </div>
      <div v-else class="flex flex-col gap-4">
        <h3 class="self-start pb-2 border-b border-[#334155]">Public Snippets</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SnippetCard
            v-for="snippet in snippets"
            :key="snippet.id"
            :snippet="snippet"
            @deleted="snippets"
            :public="true"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import Header from '@/components/layout/AppHeader.vue'
import { useFetchPublicSnippets } from '@/composables/snippets/fetch'
const { snippets, loading } = useFetchPublicSnippets()
</script>
