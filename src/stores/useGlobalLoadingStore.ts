import { ref, computed } from "vue";
import { defineStore } from "pinia";

const MIN_DISPLAY_MS = 500;

export const useGlobalLoadingStore = defineStore("globalLoading", () => {
  const _isVisible = ref(false);
  let shownAt = 0;
  let hideTimeout: ReturnType<typeof setTimeout> | null = null;

  function show() {
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = null;
    _isVisible.value = true;
    shownAt = Date.now();
  }

  function hide() {
    if (hideTimeout) clearTimeout(hideTimeout);
    const wait = Math.max(0, MIN_DISPLAY_MS - (Date.now() - shownAt));
    hideTimeout = setTimeout(() => {
      _isVisible.value = false;
      hideTimeout = null;
    }, wait);
  }

  return {
    isLoading: computed(() => _isVisible.value),
    show,
    hide,
  };
});
