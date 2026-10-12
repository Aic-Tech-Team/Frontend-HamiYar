<script setup lang="ts">
import { RouterLink } from "vue-router";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg" as-child class="hover:bg-transparent active:bg-transparent">
        <RouterLink to="/">
          <div
            class="flex aspect-square size-9 items-center justify-center rounded-lg bg-white p-1 shadow-sm"
          >
            <img src="@/assets/images/logo.svg" alt="" />
          </div>
          <div class="grid flex-1 text-start text-sm leading-tight">
            <span class="truncate font-bold text-white">سامانه حامیار</span>
            <span class="truncate text-xs text-brand-primary-200">میز کار کارکنان</span>
          </div>
        </RouterLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
