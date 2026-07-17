<template>
  <div class="flex flex-col items-center justify-center min-h-dvh text-center px-4 py-8">
    <h1
      class="text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-bold text-muted-foreground leading-none"
    >
      {{ error.code }}
    </h1>
    <h2 class="text-xl xs:text-2xl font-semibold mt-4 wrap-break-word">{{ error.title }}</h2>
    <p class="text-muted-foreground mt-2 text-sm xs:text-base max-w-md wrap-break-word">
      {{ error.description }}
    </p>
    <Button v-if="authStore.isAuthenticated" as-child class="mt-6 xs:mt-8">
      <RouterLink :to="{ name: 'Dashboard' }">بازگشت به داشبورد</RouterLink>
    </Button>
    <Button v-else as-child class="mt-6 xs:mt-8">
      <RouterLink :to="{ name: 'Landing' }">بازگشت به صفحه اصلی</RouterLink>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { appConfig } from "@/config";
import { useAuthJwtStore } from "@/stores/account/useAuthJwtStore";
import { Button } from "@/components/ui/button";

const route = useRoute();
const authStore = useAuthJwtStore();

const ERROR_MAP: Record<number, { title: string; description: string }> = {
  404: {
    title: "صفحه مورد نظر پیدا نشد",
    description: "متاسفانه صفحه‌ای که دنبال آن هستید وجود ندارد یا جابجا شده است.",
  },
  410: {
    title: "درخواست منقضی شده",
    description: "این درخواست منقضی شده و دیگر در دسترس نیست.",
  },
  403: {
    title: "دسترسی غیرمجاز",
    description: "شما اجازه دسترسی به این بخش را ندارید.",
  },
  500: {
    title: "خطای سرور",
    description: "متاسفانه خطایی در سرور رخ داده است. لطفاً بعداً تلاش کنید.",
  },
};

const DEFAULT_ERROR = {
  title: "خطایی رخ داده است",
  description: "متاسفانه خطای غیرمنتظره‌ای رخ داده است.",
};

const error = computed(() => {
  const codeParam = route.params.code as string;
  const parsed = parseInt(codeParam, 10);
  const code = Number.isNaN(parsed) ? 404 : parsed;
  const config = ERROR_MAP[code] || DEFAULT_ERROR;
  return { code, ...config };
});

watchEffect(() => {
  document.title = `${error.value.title} | ${appConfig.app.name}`;
});
</script>
