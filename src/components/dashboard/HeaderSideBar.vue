<script setup lang="ts">

import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground"
            >
              <img src="@/assets/images/logo.svg" />
            </div>
            <div class="grid flex-1 text-right text-sm leading-tight">
              <span class="truncate font-medium"> سامانه حامیار </span>
              <span class="truncate text-xs">سامانه یکپارچه</span>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
