<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppSidebar from "@/components/dashboard/AppSidebar.vue";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const route = useRoute();

const pageTitle = computed(() => {
  const title = route.meta.title as string | undefined;
  return title?.split("|")[0]?.trim() ?? "";
});

const todayLabel = new Intl.DateTimeFormat("fa-IR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset class="bg-(--dashboard-canvas)!">
      <header
        class="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-brand-primary-100 bg-(--dashboard-canvas)/90 px-4 backdrop-blur sm:px-8"
      >
        <div class="flex items-center gap-3">
          <SidebarTrigger class="text-brand-primary-700 hover:bg-brand-primary-100" />
          <span class="h-5 w-px bg-brand-primary-200" aria-hidden="true" />
          <span class="text-sm font-medium text-brand-primary-800">{{ pageTitle }}</span>
        </div>
        <time class="hidden text-sm text-muted-foreground sm:block">{{ todayLabel }}</time>
      </header>

      <div class="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-8 sm:py-10">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
