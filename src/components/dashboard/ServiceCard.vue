<script setup lang="ts">
import { computed } from "vue";
import type { Component } from "vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import IconMdiArrowLeft from "~icons/mdi/arrow-left";

interface Props {
  icon: Component;
  title: string;
  description: string;
  isActive?: boolean;
  isSupported?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: true,
  isSupported: true,
});

// "فعال" only when BOTH flags are true. If exactly one is true, it's
// "به زودی". Cards where both are false are filtered out entirely by the
// parent (see ServicesSection.vue) — this component never has to handle
// that case itself.
const isFullyActive = computed(() => props.isActive && props.isSupported);

const emit = defineEmits<{
  "start-service": [];
}>();
</script>

<template>
  <article
    class="service-card w-full rounded-2xl bg-brand-primary-50/40 border border-border shadow-sm p-4 xs:p-5 flex flex-col xs:flex-row xs:items-center gap-4"
    :class="{ 'opacity-70': !isFullyActive }"
  >
    <div
      class="size-12 xs:size-14 rounded-xl bg-brand-primary-100/60 flex items-center justify-center shrink-0"
      :class="{ grayscale: !isFullyActive }"
    >
      <component :is="props.icon" class="size-6 xs:size-7 text-brand-primary-600" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 flex-wrap">
        <h3 class="text-sm xs:text-base font-semibold text-brand-primary-700">
          {{ props.title }}
        </h3>
        <Badge v-if="isFullyActive" class="bg-emerald-100 text-emerald-700 border-emerald-200">
          فعال
        </Badge>
        <Badge v-else variant="secondary" class="bg-blue-100 text-blue-700 border-blue-200"> به زودی </Badge>
      </div>
      <p class="text-xs xs:text-sm text-muted-foreground mt-1 leading-relaxed">
        {{ props.description }}
      </p>
    </div>

    <Button
      size="lg"
      variant="outline"
      class="w-full xs:w-auto shrink-0 border-2"
      :disabled="!isFullyActive"
      @click="emit('start-service')"
    >
      <template v-if="isFullyActive">
        شروع درخواست
        <IconMdiArrowLeft class="size-5" />
      </template>
      <template v-else> به زودی... </template>
    </Button>
  </article>
</template>

<style scoped>
.service-card {
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1);
}

@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
  }

  .service-card:hover {
    transform: none;
  }
}
</style>