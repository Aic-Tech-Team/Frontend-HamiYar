<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGlobalLoadingStore } from "@/stores/useGlobalLoadingStore";

import IconGgSpinner from "~icons/gg/spinner";

const globalLoadingStore = useGlobalLoadingStore();
const { isLoading } = storeToRefs(globalLoadingStore);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="isLoading"
        class="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-md"
        aria-live="polite"
        aria-busy="true"
        role="status"
      >
        <div
          class="flex flex-col items-center gap-4 rounded-2xl bg-background/95 px-8 py-6 shadow-lg border border-border"
        >
          <IconGgSpinner class="size-12 text-brand-primary-600 animate-spin" aria-hidden="true" />
          <p class="text-sm font-medium text-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
