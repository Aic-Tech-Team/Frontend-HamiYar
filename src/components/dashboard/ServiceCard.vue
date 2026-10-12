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
// parent — this component never has to handle that case itself.
const isFullyActive = computed(() => props.isActive && props.isSupported);

const emit = defineEmits<{
  "start-service": [];
}>();
</script>

<template>
  <article
    class="service-card flex h-full flex-col gap-4 rounded-2xl border bg-white p-5"
    :class="
      isFullyActive
        ? 'border-brand-primary-200 shadow-[0_1px_0_0_var(--color-brand-primary-100)]'
        : 'border-dashed border-brand-primary-200/80 bg-transparent'
    "
  >
    <div class="flex items-start justify-between gap-3">
      <div
        class="flex size-12 shrink-0 items-center justify-center rounded-xl"
        :class="
          isFullyActive
            ? 'bg-brand-primary-600 text-white'
            : 'bg-brand-primary-100/70 text-brand-primary-400'
        "
      >
        <component :is="props.icon" class="size-6" />
      </div>
      <Badge
        v-if="isFullyActive"
        class="border-emerald-200 bg-emerald-50 text-emerald-700"
        variant="outline"
      >
        فعال
      </Badge>
      <Badge v-else variant="outline" class="border-amber-200 bg-amber-50 text-amber-700">
        به زودی
      </Badge>
    </div>

    <div class="flex-1">
      <h3
        class="text-base font-semibold"
        :class="isFullyActive ? 'text-brand-primary-900' : 'text-brand-primary-800/70'"
      >
        {{ props.title }}
      </h3>
      <p class="mt-1.5 text-sm leading-7 text-muted-foreground">
        {{ props.description }}
      </p>
    </div>

    <Button
      v-if="isFullyActive"
      size="lg"
      class="w-full justify-between"
      @click="emit('start-service')"
    >
      شروع درخواست
      <IconMdiArrowLeft class="size-5" />
    </Button>
  </article>
</template>

<style scoped>
.service-card {
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.service-card:hover {
  border-color: var(--color-brand-primary-400);
  box-shadow: 0 8px 24px -12px rgb(83 33 180 / 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .service-card {
    transition: none;
  }
}
</style>
