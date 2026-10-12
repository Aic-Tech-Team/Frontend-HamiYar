<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { ArrowLeft, FileText, Loader2, RotateCw, TriangleAlert } from "@lucide/vue";
import { useOverviewApi } from "@/composables/api/useOverviewApi";
import { services } from "@/constants/services";

import IconSolarDiplomaVerifiedOutline from "~icons/solar/diploma-verified-outline";

interface OverviewSource {
  id: string;
  label: string;
  icon: typeof FileText;
  fetchCount: () => Promise<number>;
}

// One entry per request type that actually has a real overview/count endpoint.
// When internship/etela get their own endpoint later, add one more object here —
// nothing else in this file needs to change.
const { getEducationOverviewCount } = useOverviewApi();

const overviewSources: OverviewSource[] = [
  {
    id: "education",
    label: "گواهی اشتغال به تحصیل",
    icon: FileText,
    fetchCount: getEducationOverviewCount,
  },
];

const counts = ref<Record<string, number | null>>({});
const errors = ref<Record<string, string | null>>({});
const isLoading = ref(true);

async function loadCounts() {
  isLoading.value = true;

  const results = await Promise.allSettled(overviewSources.map((source) => source.fetchCount()));

  results.forEach((result, index) => {
    const source = overviewSources[index];

    if (result.status === "fulfilled") {
      counts.value[source.id] = result.value;
      errors.value[source.id] = null;
      return;
    }

    // Keep the real reason visible in the console — a silent "—" hides
    // whether it's a network, auth or missing-endpoint problem.
    console.error(`Overview count failed for "${source.id}":`, result.reason);
    const status = result.reason?.response?.status;
    counts.value[source.id] = null;
    errors.value[source.id] = status
      ? `خطا ${status.toLocaleString("fa-IR")} از سرور`
      : "ارتباط با سرور برقرار نشد";
  });

  isLoading.value = false;
}

onMounted(loadCounts);

const activeServices = computed(() =>
  services.filter((service) => service.isActive && service.isSupported),
);
const upcomingServicesCount = computed(
  () => services.filter((service) => service.isSupported && !service.isActive).length,
);
</script>

<template>
  <!-- Welcome panel: the one bold element of the page -->
  <section
    class="relative mb-8 overflow-hidden rounded-3xl bg-brand-primary-700 p-6 text-white sm:p-10"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.18]"
      style="
        background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0);
        background-size: 22px 22px;
        mask-image: linear-gradient(to left, transparent 30%, #000 100%);
      "
      aria-hidden="true"
    />
    <IconSolarDiplomaVerifiedOutline
      class="pointer-events-none absolute -bottom-10 -start-6 size-56 text-white/10"
      aria-hidden="true"
    />

    <div class="relative max-w-xl">
      <h1 class="text-2xl font-bold leading-relaxed xs:text-3xl">میز کار حامیار</h1>
      <p class="mt-3 leading-8 text-brand-primary-100">
        درخواست‌های دانشجویان را از همین‌جا ثبت کنید. کافی است خدمت را انتخاب کنید و شماره
        دانشجویی یا کد ملی را وارد کنید.
      </p>
      <RouterLink
        to="/dashboard/services"
        class="group mt-6 inline-flex h-12 items-center gap-3 rounded-xl bg-white px-6 font-semibold text-brand-primary-800 transition-colors hover:bg-brand-primary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        ثبت درخواست جدید
        <ArrowLeft class="size-5 transition-transform group-hover:-translate-x-1" />
      </RouterLink>
    </div>
  </section>

  <!-- Numbers -->
  <section aria-labelledby="overview-counts" class="mb-8">
    <h2 id="overview-counts" class="mb-4 text-sm font-semibold text-brand-primary-700">
      وضعیت سامانه
    </h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        v-for="source in overviewSources"
        :key="source.id"
        class="rounded-2xl border border-brand-primary-200 bg-white p-5"
      >
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <component :is="source.icon" class="size-4 text-brand-primary-500" />
          {{ source.label }}
        </div>

        <p v-if="isLoading" class="mt-3 flex h-10 items-center" aria-label="در حال بارگذاری">
          <Loader2 class="size-5 animate-spin text-muted-foreground" />
        </p>
        <div v-else-if="errors[source.id]" class="mt-3">
          <p class="flex items-center gap-1.5 text-sm text-amber-700">
            <TriangleAlert class="size-4 shrink-0" />
            {{ errors[source.id] }}
          </p>
          <button
            type="button"
            class="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary-600 hover:text-brand-primary-800 focus-visible:outline-2 focus-visible:outline-brand-primary-500"
            @click="loadCounts"
          >
            <RotateCw class="size-3.5" />
            تلاش دوباره
          </button>
        </div>
        <p v-else class="mt-3 text-4xl font-bold tabular-nums text-brand-primary-900">
          {{ counts[source.id]?.toLocaleString("fa-IR") }}
        </p>
        <p v-if="!isLoading && !errors[source.id]" class="mt-1 text-xs text-muted-foreground">
          درخواست ثبت‌شده
        </p>
      </div>

      <div class="rounded-2xl border border-brand-primary-200 bg-white p-5">
        <p class="text-sm text-muted-foreground">خدمت فعال</p>
        <p class="mt-3 text-4xl font-bold tabular-nums text-brand-primary-900">
          {{ activeServices.length.toLocaleString("fa-IR") }}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">آماده ثبت درخواست</p>
      </div>

      <div
        v-if="upcomingServicesCount > 0"
        class="rounded-2xl border border-dashed border-brand-primary-200 p-5"
      >
        <p class="text-sm text-muted-foreground">خدمت در راه</p>
        <p class="mt-3 text-4xl font-bold tabular-nums text-brand-primary-400">
          {{ upcomingServicesCount.toLocaleString("fa-IR") }}
        </p>
        <p class="mt-1 text-xs text-muted-foreground">به‌زودی اضافه می‌شود</p>
      </div>
    </div>
  </section>

  <!-- Shortcuts -->
  <section aria-labelledby="quick-start">
    <div class="mb-4 flex items-center justify-between">
      <h2 id="quick-start" class="text-sm font-semibold text-brand-primary-700">
        دسترسی سریع
      </h2>
      <RouterLink
        to="/dashboard/services"
        class="text-sm font-medium text-brand-primary-600 hover:text-brand-primary-800"
      >
        همه خدمات
      </RouterLink>
    </div>
    <ul class="divide-y divide-brand-primary-100 overflow-hidden rounded-2xl border border-brand-primary-200 bg-white">
      <li v-for="service in activeServices" :key="service.id">
        <RouterLink
          to="/dashboard/services"
          class="group flex items-center gap-4 p-4 transition-colors hover:bg-brand-primary-50/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-primary-500"
        >
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-primary-100 text-brand-primary-700"
          >
            <component :is="service.icon" class="size-6" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block font-semibold text-brand-primary-900">{{ service.title }}</span>
            <span class="mt-0.5 block truncate text-sm text-muted-foreground">
              {{ service.description }}
            </span>
          </span>
          <ArrowLeft
            class="size-5 shrink-0 text-brand-primary-400 transition-transform group-hover:-translate-x-1"
          />
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
