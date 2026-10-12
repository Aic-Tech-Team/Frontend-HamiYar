<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";

import IconMynauiSaveSolid from "~icons/mynaui/save-solid";
import IconGgSpinner from "~icons/gg/spinner";
import IconMdiInformationOutline from "~icons/mdi/information-outline";

export interface MobileSummaryRow {
  label: string;
  value?: string | number | null;
}

interface Props {
  title: string;
  description?: string;
  /** Read-only facts already known from the student's record. */
  summary?: MobileSummaryRow[];
  /** How many required fields are still empty. */
  missingCount: number;
  isSubmitting: boolean;
  /** `phone`: stacked page with a fixed submit bar. `desktop`: side panel next to the live preview. */
  variant?: "phone" | "desktop";
}

const props = withDefaults(defineProps<Props>(), {
  summary: () => [],
  variant: "phone",
});

const emit = defineEmits<{
  submit: [];
}>();

const visibleSummary = computed(() =>
  props.summary.filter((row) => String(row.value ?? "").trim().length > 0),
);

const canSubmit = computed(() => props.missingCount === 0 && !props.isSubmitting);
const isPhone = computed(() => props.variant === "phone");
</script>

<template>
  <div class="flex flex-col gap-4 text-start">
    <header class="rounded-2xl bg-brand-primary-700 p-5 text-white">
      <p class="text-xs text-brand-primary-100">ثبت درخواست</p>
      <h1 class="mt-1 text-xl font-bold leading-relaxed">{{ title }}</h1>
      <p v-if="description" class="mt-2 text-sm leading-7 text-brand-primary-100">
        {{ description }}
      </p>
    </header>

    <section
      v-if="visibleSummary.length"
      class="rounded-2xl border border-brand-primary-200 bg-white p-4"
      aria-labelledby="mobile-summary"
    >
      <h2 id="mobile-summary" class="mb-1 text-sm font-semibold text-brand-primary-700">
        اطلاعات دانشجو
      </h2>
      <dl class="divide-y divide-brand-primary-100">
        <div
          v-for="row in visibleSummary"
          :key="row.label"
          class="flex items-baseline justify-between gap-4 py-2.5 text-sm"
        >
          <dt class="shrink-0 text-muted-foreground">{{ row.label }}</dt>
          <dd class="min-w-0 break-words text-end font-medium text-foreground">{{ row.value }}</dd>
        </div>
      </dl>
    </section>

    <section
      class="rounded-2xl border border-brand-primary-200 bg-white p-4"
      aria-labelledby="mobile-fields"
    >
      <h2 id="mobile-fields" class="mb-4 text-sm font-semibold text-brand-primary-700">
        اطلاعات درخواست
      </h2>
      <div class="flex flex-col gap-5">
        <slot />
      </div>
    </section>

    <p class="flex items-start gap-2 px-1 text-xs leading-6 text-muted-foreground">
      <IconMdiInformationOutline class="mt-0.5 size-4 shrink-0 text-brand-primary-500" />
      <template v-if="isPhone">
        بعد از ثبت، نسخه رسمی و آماده چاپ با قالب برگه A4 نمایش داده می‌شود.
      </template>
      <template v-else>
        هر مقداری که وارد می‌کنید همان لحظه روی برگه رسمی در کنار فرم دیده می‌شود.
      </template>
    </p>

    <div
      :class="
        isPhone
          ? 'fixed inset-x-0 bottom-0 z-20 border-t border-brand-primary-100 bg-white/95 p-3 backdrop-blur'
          : ''
      "
    >
      <p v-if="missingCount > 0" class="mb-2 text-center text-xs text-amber-700">
        {{ missingCount.toLocaleString("fa-IR") }} فیلد اجباری باقی مانده است
      </p>
      <Button
        size="lg"
        class="h-12 w-full text-base"
        :disabled="!canSubmit"
        @click="emit('submit')"
      >
        <IconMynauiSaveSolid v-if="!isSubmitting" class="size-6" />
        <IconGgSpinner v-else class="size-6 animate-spin" />
        {{ isSubmitting ? "در حال ثبت..." : "ثبت اطلاعات" }}
      </Button>
    </div>
  </div>
</template>
