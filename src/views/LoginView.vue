<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
import { appConfig } from "@/config";
</script>

<template>
  <div class="grid min-h-svh lg:grid-cols-2">
    <div class="flex flex-col gap-4 p-4 xs:p-6 md:p-10">
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-sm min-w-0">
          <div class="flex flex-col items-center gap-2 text-center mb-4 xs:mb-6">
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
    </div>

    <div class="bg-muted relative hidden lg:block">
      <!-- This is the placeholder and the image has to change. This for showcasing the placeholder -->
      <img
        src="@/assets/images/logo.svg"
        alt="حامی یار"
        class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>
