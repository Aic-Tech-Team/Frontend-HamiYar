<script setup lang="ts">
import type { Component } from "vue";
import { RouterLink, useRoute } from "vue-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  to: string;
  icon?: Component;
}

defineProps<{
  items: NavItem[];
}>();

const route = useRoute();

function isActiveRoute(to: string) {
  return route.path === to;
}
</script>

<template>
  <SidebarGroup>
    <SidebarGroupContent>
      <SidebarMenu class="gap-1">
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton
            :tooltip="item.title"
            as-child
            :is-active="isActiveRoute(item.to)"
            class="relative h-10 data-[active=true]:before:absolute data-[active=true]:before:inset-y-2 data-[active=true]:before:end-0 data-[active=true]:before:w-1 data-[active=true]:before:rounded-full data-[active=true]:before:bg-brand-primary-300"
          >
            <RouterLink :to="item.to">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
