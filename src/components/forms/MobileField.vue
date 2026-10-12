<script setup lang="ts">
defineProps<{
  label: string;
  /** Matches the id of the control rendered in the default slot. */
  for?: string;
  required?: boolean;
  hint?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="$props.for" class="text-sm font-medium text-foreground">
      {{ label }}
      <span v-if="required" class="text-destructive" aria-hidden="true">*</span>
      <span v-else class="text-xs font-normal text-muted-foreground">(اختیاری)</span>
    </label>
    <slot />
    <p v-if="hint" class="text-xs leading-6 text-muted-foreground">{{ hint }}</p>
  </div>
</template>
