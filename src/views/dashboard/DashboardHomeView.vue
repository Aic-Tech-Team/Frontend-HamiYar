<script setup lang="ts">
import { ref, onMounted } from "vue";
import { FileText, Loader2 } from "@lucide/vue";
import { useOverviewApi } from "@/composables/api/useOverviewApi";

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
const isLoading = ref(true);

onMounted(async () => {
  const results = await Promise.allSettled(
    overviewSources.map((source) => source.fetchCount()),
  );

  results.forEach((result, index) => {
    const source = overviewSources[index];
    counts.value[source.id] = result.status === "fulfilled" ? result.value : null;
  });

  isLoading.value = false;
});
</script>

<template>
  <div class="w-full max-w-max mb-10 flex-col-center items-start gap-4 text-start">
    <h1 class="text-2xl xs:text-3xl font-bold text-foreground">نمای کلی</h1>
    <p class="text-muted-foreground">خلاصه‌ای از وضعیت سامانه در یک نگاه.</p>
    <hr class="w-full h-1 bg-brand-primary-500 border-none rounded-full" />
  </div>

  <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="source in overviewSources"
      :key="source.id"
      class="rounded-2xl border border-border bg-card p-5 flex items-center gap-4"
    >
      <div
        class="size-11 rounded-xl flex items-center justify-center shrink-0 bg-brand-primary-100 text-brand-primary-600"
      >
        <component :is="source.icon" class="size-5" />
      </div>
      <div class="min-w-0">
        <p v-if="isLoading" class="h-8 flex items-center">
          <Loader2 class="size-5 text-muted-foreground animate-spin" />
        </p>
        <p v-else-if="counts[source.id] === null" class="text-2xl font-bold text-muted-foreground">
          —
        </p>
        <p v-else class="text-2xl font-bold text-foreground">
          {{ counts[source.id]?.toLocaleString("fa-IR") }}
        </p>
        <p class="text-xs text-muted-foreground mt-0.5">{{ source.label }}</p>
      </div>
    </div>
  </div>
</template>