import { computed, onBeforeUnmount, ref, watch } from "vue";
import type { Ref } from "vue";
import { useMediaQuery } from "@vueuse/core";

/**
 * How the form page is currently presented. A form view sets it, `FormLayout`
 * reads it to pick the page chrome.
 *
 * - `phone`   narrow screens, before submit: stacked labelled form, no paper
 * - `desktop` wide screens, before submit: form beside a live A4 preview
 * - `null`    after submit / public view: the A4 sheet alone
 */
export type FormEntryMode = "phone" | "desktop" | null;

const formEntryMode = ref<FormEntryMode>(null);

export function useFormEntryMode() {
  return { formEntryMode };
}

/** Below this width a side-by-side preview would be too small to read. */
const SPLIT_MIN_WIDTH = 1024;

export function useMobileEntryMode(isSubmitted: Ref<boolean>, isPrintView: Ref<boolean>) {
  const isNarrow = useMediaQuery(`(max-width: ${SPLIT_MIN_WIDTH - 1}px)`);

  const isEntering = computed(() => !isSubmitted.value && !isPrintView.value);
  const isMobileEntry = computed(() => isEntering.value && isNarrow.value);
  const isDesktopEntry = computed(() => isEntering.value && !isNarrow.value);

  // Final values are shown as plain text (never disabled inputs) once the
  // request is submitted, on the public view, and in the live preview.
  const showStatic = computed(() => isPrintView.value || isSubmitted.value || isDesktopEntry.value);

  watch(
    [isMobileEntry, isDesktopEntry],
    ([phone, desktop]) => {
      formEntryMode.value = phone ? "phone" : desktop ? "desktop" : null;
    },
    { immediate: true },
  );

  // After submitting, the paper version replaces the entry screen — start at its top.
  watch(isEntering, (entering, wasEntering) => {
    if (wasEntering && !entering) window.scrollTo({ top: 0 });
  });

  onBeforeUnmount(() => {
    formEntryMode.value = null;
  });

  return { isMobileEntry, isDesktopEntry, showStatic };
}
