<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay.vue";
</script>
 
<template>
  <div class="relative flex flex-col min-h-screen">
    <main class="flex-1 print:p-0">
      <RouterView />
    </main>
 
    <GlobalLoadingOverlay />
    <Toaster />
  </div>
</template>
 
<style scoped></style>