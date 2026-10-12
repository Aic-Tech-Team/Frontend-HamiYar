<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { Button } from "@/components/ui/button";
import { useFormEntryMode } from "@/composables/useMobileEntryMode";

import IconIconParkSolidBack from "~icons/icon-park-solid/back";

const route = useRoute();
const router = useRouter();
const { formEntryMode } = useFormEntryMode();

const showExitConfirm = computed(() => !route.meta.print);

// Each presentation needs different page chrome around the same view:
//   phone   → narrow stacked form on the dashboard canvas
//   desktop → form + live preview, wider container on the canvas
//   sheet   → the A4 sheet alone (after submit and on the public view)
const wrapperClass = computed(() => {
  switch (formEntryMode.value) {
    case "phone":
      return "mx-auto w-full max-w-xl px-4 pb-32 pt-14";
    case "desktop":
      return "mx-auto w-full max-w-6xl px-8 pb-12 pt-16";
    default:
      return "form-print-wrapper pt-14 pb-28 md:py-16 print:p-0";
  }
});

function handleExitPage() {
  router.push({ name: "Dashboard" });
}
</script>

<template>
  <div
    class="relative form-print-root font-vazir"
    :class="formEntryMode ? 'min-h-screen bg-(--dashboard-canvas)' : ''"
  >
    <ConfirmDialog
      v-if="showExitConfirm"
      title="تأیید خروج از صفحه"
      description="با خروج از این صفحه، اطلاعات واردشده ذخیره نخواهد شد. آیا از خروج از صفحه اطمینان دارید؟"
      confirm-text="تأیید خروج"
      cancel-text="انصراف"
      @confirm="handleExitPage"
    >
      <template #trigger>
        <Button
          variant="default"
          size="sm"
          aria-label="بازگشت"
          class="fixed left-3 top-3 z-30 print:hidden"
        >
          <IconIconParkSolidBack width="16" height="16" />
          بازگشت
        </Button>
      </template>
    </ConfirmDialog>

    <!-- Desktop: toolbar for the final document (print, copy link, ...) -->
    <div
      id="form-toolbar"
      class="sticky top-0 z-20 border-b border-brand-primary-100 bg-white/95 py-3 backdrop-blur empty:hidden max-md:hidden print:hidden"
    ></div>

    <div :class="wrapperClass">
      <slot />
    </div>

    <!-- Phone: action buttons live outside the scaled sheet so they stay full size -->
    <div
      id="form-mobile-actions"
      class="fixed inset-x-0 bottom-0 z-20 border-t border-brand-primary-100 bg-white/95 p-3 backdrop-blur empty:hidden md:hidden print:hidden"
    ></div>
  </div>
</template>

<style scoped>
@media print {
  .form-print-root {
    position: relative !important;
    width: 210mm !important;
    height: 297mm !important;
    max-height: 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    box-sizing: border-box;
  }

  .form-print-wrapper {
    position: relative !important;
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
  }
}
</style>
