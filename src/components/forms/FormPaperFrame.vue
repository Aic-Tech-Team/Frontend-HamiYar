<script setup lang="ts">
import { computed, ref } from "vue";
import { useElementSize } from "@vueuse/core";
import { useRoute } from "vue-router";

// A4 at 96dpi (210mm). The sheet is always laid out at this size and then
// scaled to the width of its container, so the official format never reflows.
const SHEET_WIDTH_PX = 794;
const SCREEN_GUTTER_PX = 16;

const props = defineProps<{
  /** Live, read-only preview shown beside the entry form. */
  preview?: boolean;
  submitted?: boolean;
}>();

const route = useRoute();

const boxEl = ref<HTMLElement | null>(null);
const sheetEl = ref<HTMLElement | null>(null);
const { width: boxWidth } = useElementSize(boxEl, { width: SHEET_WIDTH_PX, height: 0 });
const { height: sheetHeight } = useElementSize(
  sheetEl,
  { width: SHEET_WIDTH_PX, height: 1123 },
  { box: "border-box" },
);

const scale = computed(() => {
  const gutter = props.preview ? 0 : SCREEN_GUTTER_PX * 2;
  return Math.min(1, Math.max(0.3, (boxWidth.value - gutter) / SHEET_WIDTH_PX));
});

const fixedHeight = computed(() => route.meta.print === true || props.submitted === true);
</script>

<template>
  <div
    ref="boxEl"
    class="form-print-box flex w-full flex-col items-center"
    :class="preview ? 'self-start lg:sticky lg:top-6' : ''"
  >
    <p
      v-if="preview"
      class="mb-3 self-start text-sm font-semibold text-brand-primary-700 print:hidden"
    >
      پیش‌نمایش برگه
    </p>

    <div
      class="form-print-scaler relative shrink-0"
      :style="{
        width: `${SHEET_WIDTH_PX * scale}px`,
        height: `${sheetHeight * scale}px`,
      }"
    >
      <div
        ref="sheetEl"
        class="form-print-sheet absolute left-0 top-0 flex w-[210mm] origin-top-left flex-col bg-white p-[4mm] shadow-[0_0_10px_rgba(0,0,0,0.1)] print:m-0 print:shadow-none"
        :class="[
          fixedHeight ? 'h-[297mm]' : 'min-h-[297mm]',
          preview ? 'pointer-events-none select-none ring-1 ring-brand-primary-200' : '',
        ]"
        :style="{ transform: `scale(${scale})` }"
        :aria-hidden="preview ? 'true' : undefined"
      >
        <div class="relative flex h-full w-full grow flex-col border-2 border-black p-6">
          <slot />

          <div
            class="absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-black opacity-30"
          ></div>
          <div
            class="absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-black opacity-30"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  .form-print-box {
    display: block !important;
    position: static !important;
    width: 210mm !important;
  }

  .form-print-scaler {
    width: 210mm !important;
    height: 297mm !important;
  }

  .form-print-sheet {
    position: relative !important;
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    padding: 4mm !important;
    box-sizing: border-box;
    transform: none !important;
  }
}
</style>
