<script setup lang="ts">
import { FileText, Clock, CheckCircle2, Users } from "@lucide/vue";

const stats = [
  {
    label: "درخواست‌های امروز",
    value: "۱۲",
    icon: FileText,
    accent: "bg-brand-primary-100 text-brand-primary-600",
  },
  {
    label: "در حال بررسی",
    value: "۵",
    icon: Clock,
    accent: "bg-amber-100 text-amber-600",
  },
  {
    label: "تکمیل‌شده این ماه",
    value: "۱۸۴",
    icon: CheckCircle2,
    accent: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "دانشجویان فعال",
    value: "۹۶۰",
    icon: Users,
    accent: "bg-sky-100 text-sky-600",
  },
];
</script>

<template>
  <div class="w-full max-w-max mb-10 flex-col-center items-start gap-4 text-start">
    <h1 class="text-2xl xs:text-3xl font-bold text-foreground">نمای کلی</h1>
    <p class="text-muted-foreground">خلاصه‌ای از وضعیت سامانه در یک نگاه.</p>
    <hr class="w-full h-1 bg-brand-primary-500 border-none rounded-full" />
  </div>

  <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="rounded-2xl border border-border bg-card p-5 flex items-center gap-4"
    >
      <div
        class="size-11 rounded-xl flex items-center justify-center shrink-0"
        :class="stat.accent"
      >
        <component :is="stat.icon" class="size-5" />
      </div>
      <div class="min-w-0">
        <p class="text-2xl font-bold text-foreground">{{ stat.value }}</p>
        <p class="text-xs text-muted-foreground mt-0.5">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>