<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { Button } from "@/components/ui/button";

import IconIconParkSolidBack from "~icons/icon-park-solid/back";

const route = useRoute();
const router = useRouter();

const showExitConfirm = computed(() => !route.meta.print);
const sheetHeightClass = computed(() => (route.meta.print ? "h-[297mm]" : "min-h-[297mm]"));

function handleExitPage() {
  router.push({ name: "Dashboard" });
}
</script>

<template>
  <div class="relative form-print-root font-vazir">
    <ConfirmDialog
      v-if="showExitConfirm"
      title="تأیید خروج از صفحه"
      description="با خروج از این صفحه، اطلاعات واردشده ذخیره نخواهد شد. آیا از خروج از صفحه اطمینان دارید؟"
      confirm-text="تأیید خروج"
      cancel-text="انصراف"
      @confirm="handleExitPage"
    >
      <template #trigger>
        <Button variant="default" aria-label="Back" class="fixed left-3 top-3">
          <IconIconParkSolidBack width="48" height="48" />
          بازگشت
        </Button>
      </template>
    </ConfirmDialog>

    <div class="form-print-wrapper flex justify-center items-center py-16 print:p-0">
      <div
        class="form-print-sheet w-[210mm] bg-white mx-auto p-[4mm] relative shadow-[0_0_10px_rgba(0,0,0,0.1)] flex flex-col print:m-0 print:shadow-none has-[[data-submitted]]:h-[297mm]"
        :class="sheetHeightClass"
      >
        <div class="border-2 border-black w-full h-full flex flex-col p-6 relative grow">
          <slot />

          <div
            class="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-black opacity-30"
          ></div>
          <div
            class="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-black opacity-30"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";

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

  .form-print-sheet {
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    padding: 4mm !important;
    box-sizing: border-box;
  }
}
</style>
