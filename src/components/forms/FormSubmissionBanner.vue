<script setup lang="ts">
import { RouterLink } from "vue-router";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";

import IconMdiCheckCircle from "~icons/mdi/check-circle";
import IconMdiContentCopy from "~icons/mdi/content-copy";
import IconMdiFileDocumentCheck from "~icons/mdi/file-document-check";
import IconMdiPlus from "~icons/mdi/plus";

const props = defineProps<{
  trackingNumber: string;
  /** Absolute link to the public final document. */
  documentLink: string;
}>();

const emit = defineEmits<{
  issue: [];
}>();

async function copy(text: string, message: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(message, { richColors: true });
  } catch {
    toast.error("کپی انجام نشد.", { richColors: true });
  }
}
</script>

<template>
  <section
    class="mx-auto mb-6 w-full max-w-[794px] rounded-2xl border border-emerald-200 bg-white p-5 text-start print:hidden"
    aria-live="polite"
  >
    <div class="flex items-start gap-3">
      <IconMdiCheckCircle class="mt-0.5 size-7 shrink-0 text-emerald-600" />
      <div class="min-w-0">
        <h2 class="text-lg font-bold text-brand-primary-900">درخواست ثبت شد</h2>
        <p class="mt-1 text-sm leading-7 text-muted-foreground">
          برگه زیر نسخه نهایی است. برای چاپ یا ارسال به دانشجو، سند نهایی را باز کنید.
        </p>
      </div>
    </div>

    <div
      class="mt-4 flex items-center justify-between gap-3 rounded-xl bg-brand-primary-50 px-4 py-3"
    >
      <div class="min-w-0">
        <p class="text-xs text-muted-foreground">کد پیگیری</p>
        <p
          dir="ltr"
          class="truncate text-start text-lg font-bold tabular-nums text-brand-primary-900"
        >
          {{ props.trackingNumber }}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        class="shrink-0"
        @click="copy(props.trackingNumber, 'کد پیگیری کپی شد.')"
      >
        <IconMdiContentCopy class="size-4" />
        کپی کد
      </Button>
    </div>

    <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button size="lg" class="h-12 sm:h-11" @click="emit('issue')">
        <IconMdiFileDocumentCheck class="size-5" />
        مشاهده و چاپ سند نهایی
      </Button>
      <Button
        variant="outline"
        size="lg"
        class="h-12 sm:h-11"
        @click="copy(props.documentLink, 'لینک سند کپی شد.')"
      >
        <IconMdiContentCopy class="size-5" />
        کپی لینک سند
      </Button>
      <RouterLink to="/dashboard/services" class="sm:ms-auto">
        <Button variant="ghost" size="lg" class="h-12 w-full sm:h-11 sm:w-auto">
          <IconMdiPlus class="size-5" />
          ثبت درخواست جدید
        </Button>
      </RouterLink>
    </div>
  </section>
</template>
