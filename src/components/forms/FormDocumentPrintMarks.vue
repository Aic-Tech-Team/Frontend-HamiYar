<script setup lang="ts">
import { appConfig } from "@/config";

defineProps<{
  qrImageSrc?: string;
  universityName: string;
}>();

const appName = appConfig.app.name;
</script>

<template>
  <figure v-if="qrImageSrc" class="absolute bottom-5 start-5">
    <img width="150" :src="qrImageSrc" alt="qr code" class="print:grayscale" />
  </figure>

  <div class="items-center gap-2 absolute bottom-5 end-4 hidden print:flex scale-90">
    <img
      src="@/assets/images/logo.svg"
      :alt="appName"
      class="object-contain w-12 shrink-0 grayscale"
    />
    <section class="min-w-0">
      <h3 class="text-sm font-bold text-foreground">{{ appName }}</h3>
      <p class="text-[0.6rem] text-muted-foreground mt-0.5 wrap-break-word">
        {{ universityName }}
      </p>
    </section>
  </div>
</template>
