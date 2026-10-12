<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useMediaQuery } from "@vueuse/core";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { useAuthJwtStore } from "@/stores/account/useAuthJwtStore";

import IconMdiPrinter from "~icons/mdi/printer";
import IconMdiShareVariant from "~icons/mdi/share-variant-outline";
import IconMdiContentCopy from "~icons/mdi/content-copy";
import IconMdiViewDashboardOutline from "~icons/mdi/view-dashboard-outline";

// Actions for the final, public document. They live outside the sheet so they
// never print and, on phones, stay full size next to the scaled-down sheet.
const route = useRoute();
const authStore = useAuthJwtStore();

const isPhone = useMediaQuery("(max-width: 767px)");
const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

const trackingNumber = computed(() => String(route.params.trackingNumber ?? ""));
const target = computed(() => (isPhone.value ? "#form-mobile-actions" : "#form-toolbar"));

function handlePrint() {
  window.print();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("لینک سند کپی شد.", { richColors: true });
  } catch {
    toast.error("کپی لینک انجام نشد.", { richColors: true });
  }
}

async function handleShare() {
  if (!canShare) return copyLink();
  try {
    await navigator.share({ title: document.title, url: window.location.href });
  } catch {
    // User dismissed the share sheet — nothing to do.
  }
}
</script>

<template>
  <Teleport :to="target" defer>
    <div
      class="flex w-full items-center gap-3 print:hidden"
      :class="isPhone ? '' : 'mx-auto max-w-6xl px-8'"
    >
      <div v-if="!isPhone" class="min-w-0">
        <p class="text-sm font-semibold text-brand-primary-900">سند نهایی</p>
        <p v-if="trackingNumber" class="text-xs text-muted-foreground">
          کد پیگیری:
          <span dir="ltr" class="font-medium tabular-nums">{{ trackingNumber }}</span>
        </p>
      </div>

      <div class="flex gap-2" :class="isPhone ? 'w-full [&>*]:h-12 [&>*]:flex-1' : 'ms-auto'">
        <RouterLink v-if="!isPhone && authStore.isAuthenticated" :to="{ name: 'Dashboard' }">
          <Button variant="ghost" class="h-10">
            <IconMdiViewDashboardOutline class="size-5" />
            داشبورد
          </Button>
        </RouterLink>

        <Button v-if="isPhone && canShare" variant="outline" @click="handleShare">
          <IconMdiShareVariant class="size-5" />
          اشتراک‌گذاری
        </Button>
        <Button
          v-else
          variant="outline"
          class="h-10"
          :class="isPhone ? 'h-12' : ''"
          @click="copyLink"
        >
          <IconMdiContentCopy class="size-5" />
          کپی لینک
        </Button>

        <Button class="h-10" :class="isPhone ? 'h-12' : ''" @click="handlePrint">
          <IconMdiPrinter class="size-5" />
          چاپ
        </Button>
      </div>
    </div>
  </Teleport>
</template>
