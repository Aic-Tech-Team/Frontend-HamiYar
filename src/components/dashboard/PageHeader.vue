<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="mb-8 flex flex-col gap-2 text-start">
    <h1 class="text-2xl font-bold text-brand-primary-900 xs:text-3xl">{{ title }}</h1>
    <p v-if="description" class="max-w-prose leading-relaxed text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>
