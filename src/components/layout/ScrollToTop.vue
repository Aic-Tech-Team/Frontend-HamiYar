<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { ArrowUp } from "@lucide/vue";

const isVisible = ref(false);
const progress = ref(0); // 0 to 100

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

let ticking = false;

function updateScrollState() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  isVisible.value = scrollTop > 400;
  progress.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

  ticking = false;
}

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollState);
    ticking = true;
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  updateScrollState();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-75 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-75 translate-y-4"
  >
    <button
      v-if="isVisible"
      type="button"
      aria-label="بازگشت به بالای صفحه"
      class="fixed bottom-6 right-6 z-30 size-12 sm:size-14"
      @click="scrollToTop"
    >
      <span
        class="relative flex size-full items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95"
      >
        <svg class="absolute inset-0 size-full -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            :r="RADIUS"
            fill="none"
            stroke-width="3"
            class="stroke-brand-primary-100"
          />
          <circle
            cx="22"
            cy="22"
            :r="RADIUS"
            fill="none"
            stroke-width="3"
            stroke-linecap="round"
            class="stroke-brand-primary-600 transition-[stroke-dashoffset] duration-100 ease-linear"
            :stroke-dasharray="CIRCUMFERENCE"
            :stroke-dashoffset="CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE"
          />
        </svg>

        <ArrowUp class="size-5 sm:size-6 text-brand-primary-600 relative" />
      </span>
    </button>
  </Transition>
</template>