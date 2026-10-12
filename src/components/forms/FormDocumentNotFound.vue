<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";
import { useAuthJwtStore } from "@/stores/account/useAuthJwtStore";

import IconMdiFileQuestionOutline from "~icons/mdi/file-question-outline";

const authStore = useAuthJwtStore();
</script>

<template>
  <section
    class="mx-auto mt-8 w-full max-w-md rounded-2xl border border-brand-primary-200 bg-white p-8 text-center"
  >
    <span
      class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-primary-100 text-brand-primary-600"
    >
      <IconMdiFileQuestionOutline class="size-8" />
    </span>
    <h1 class="mt-4 text-lg font-bold text-brand-primary-900">سندی با این کد پیگیری پیدا نشد</h1>
    <p class="mt-2 text-sm leading-7 text-muted-foreground">
      کد را دوباره بررسی کنید. اگر لینک را از کسی گرفته‌اید، ممکن است ناقص کپی شده باشد.
    </p>
    <RouterLink :to="authStore.isAuthenticated ? { name: 'Dashboard' } : '/'" class="mt-6 block">
      <Button variant="outline" size="lg" class="w-full">
        {{ authStore.isAuthenticated ? "بازگشت به داشبورد" : "بازگشت به صفحه اصلی" }}
      </Button>
    </RouterLink>
  </section>
</template>
