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
            class="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground"
          >
            <img src="@/assets/images/logo.svg" />
          </div>
          <div class="grid flex-1 text-right text-sm leading-tight">
            <span class="truncate font-medium"> سامانه حامیار </span>
            <span class="truncate text-xs">سامانه یکپارچه</span>
          </div>
        </RouterLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>