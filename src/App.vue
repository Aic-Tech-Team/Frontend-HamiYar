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
    <RouterView />
  </component>

  <GlobalLoadingOverlay />
  <Toaster />
</template>

<style scoped></style>
