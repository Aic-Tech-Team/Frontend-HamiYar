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
import { Separator } from "@/components/ui/separator";

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
    <SidebarGroupContent class="flex flex-col gap-2">
      <Separator />
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton :tooltip="item.title" as-child :is-active="isActiveRoute(item.to)">
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