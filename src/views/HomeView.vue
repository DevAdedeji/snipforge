<template>
  <main class="w-full min-h-screen">
    <header class="px-4 py-2">
      <nav class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="/logo.svg" alt="" />
          <p class="text-xl font-bold leading-tight tracking-[-0.015em]">SnipForge</p>
        </div>
        <router-link to="/login" class="bg-primary text-text-primary-dark rounded-lg h-10 px-4 flex items-center justify-center font-medium">
          <UIcon name="i-heroicons-plus" class="block sm:hidden text-2xl" />
          <span class="hidden sm:block">Create Snippets</span>
        </router-link>
      </nav>
    </header>
    <div class="max-w-[90%] mx-auto flex flex-col gap-4 items-center justify-center h-[80vh] text-center">
      <h1 class="text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl md:text-6xl">
          Discover &amp; Share Code Snippets
      </h1>
      <p class="text-text-secondary-dark text-base font-normal leading-normal  mx-auto sm:text-lg">
          The ultimate vault for developers. Explore a world of elegant solutions and contribute your own.
      </p>
      <UButton color="primary" class="mt-4 text-text-primary-dark font-medium text-base">Explore Snippets</UButton>
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
