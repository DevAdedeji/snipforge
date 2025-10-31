<template>
  <main
    class="w-full max-w-[1500px] mx-auto h-screen flex items-center justify-center text-text-primary-dark"
  >
    <div
      class="bg-card-dark/50! p-4 sm:p-8 shadow-subtle backdrop-blur-sm border border-white/10 flex w-full max-w-[90%] mx-auto sm:max-w-md flex-col items-center justify-center gap-4 rounded-lg"
    >
      <div class="flex items-center gap-2 pb-4">
        <img src="/logo.svg" alt="" />
      </div>
      <h1
        class="text-text-primary-dark tracking-tight text-2xl md:text-3xl font-bold leading-tight text-center pb-2"
      >
        Sign in to SnipForge
      </h1>
      <p class="text-text-secondary-dark text-base font-normal leading-normal text-center pb-6">
        Access your snippets and boost your productivity.
      </p>
      <div class="flex w-full flex-col items-stretch gap-4">
        <UButton
          color="neutral"
          variant="outline"
          class="bg-[#2d3748]! h-12 text-text-primary-dark"
          @click="loginWithGoogle"
        >
          <img src="/google.svg" class="size-5" alt="google logo" />
          Continue with Google
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          class="bg-[#2d3748]! h-12 text-text-primary-dark"
          @click="loginWithGithub"
        >
          <img src="/github.svg" class="size-5" alt="github logo" />
          Continue with Github
        </UButton>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/auth'
const { loginWithGithub, loginWithGoogle } = useAuth()
</script>
