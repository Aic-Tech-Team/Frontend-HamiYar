<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay.vue";
import { resolveLayout } from "@/layouts";

const route = useRoute();
const layout = computed(() => resolveLayout(route.meta.layout));
</script>

<template>
  <component :is="layout">
    <!-- Keyed by route name so e.g. /education → /education/:trackingNumber
         remounts the view (same component, different mode) and loads its data. -->
    <RouterView v-slot="{ Component, route: viewRoute }">
      <component :is="Component" :key="String(viewRoute.name ?? viewRoute.path)" />
    </RouterView>
  </component>

  <GlobalLoadingOverlay />
  <Toaster />
</template>

<style scoped></style>
