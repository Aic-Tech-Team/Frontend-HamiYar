<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
import { appConfig } from "@/config";
</script>

<template>
  <div class="flex min-h-svh w-full items-center justify-center p-4 xs:p-6 md:p-10">
    <div class="w-full max-w-sm border-2 p-4 xs:p-6 py-6 xs:py-8 rounded-xl xs:rounded-2xl min-w-0">
      <div class="flex flex-col items-center gap-2 text-center mb-4 xs:mb-6">
        <!-- Logo -->
        <figure class="mb-2">
          <img class="w-16 xs:w-20 h-auto" src="@/assets/images/logo.svg" alt="logo" />
        </figure>

        <h1 class="text-lg xs:text-xl font-bold">ورود به حساب کاربری</h1>
        <p class="text-muted-foreground text-xs xs:text-sm leading-relaxed wrap-break-word">
          به سامانه یکپارچه خدماتی حامی یار
          {{ appConfig.university.name }}
          خوش آمدید.
        </p>
      </div>

      <LoginForm />
    </div>
  </div>
</template>
