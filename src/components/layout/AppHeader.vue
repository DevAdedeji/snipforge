<template>
  <header class="border-b border-[#334155] px-4 py-2">
    <nav class="flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <img src="/logo.svg" alt="" />
        <p class="text-xl font-bold leading-tight tracking-[-0.015em]">SnipForge</p>
      </router-link>
      <slot name="actions" />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
