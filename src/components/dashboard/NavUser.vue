<script setup lang="ts">
import { useAuthApi } from "@/composables/api/useAuthApi";
import { ChevronsUpDown, LogOut, UserRound } from "@lucide/vue";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

defineProps<{
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}>();

const { logoutAsync } = useAuthApi();

async function handleLogout() {
  await logoutAsync();
}
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
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="user.avatar" :alt="user.name" />
              <AvatarFallback class="rounded-lg bg-white/15">
                <UserRound class="size-4 text-white" />
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-start text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs text-brand-primary-200">{{ user.email }}</span>
            </div>
            <ChevronsUpDown class="ms-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="dir-rtl w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-xl p-1.5"
          side="top"
          align="center"
          :side-offset="8"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-3 px-2 py-2 text-start">
              <Avatar class="size-9 rounded-lg">
                <AvatarImage :src="user.avatar" :alt="user.name" />
                <AvatarFallback class="rounded-lg bg-brand-primary-100">
                  <UserRound class="size-4 text-brand-primary-600" />
                </AvatarFallback>
              </Avatar>
              <div class="grid min-w-0 flex-1 leading-tight">
                <span class="truncate text-sm font-semibold text-foreground">{{ user.name }}</span>
                <span v-if="user.email" class="truncate text-xs text-muted-foreground">
                  {{ user.email }}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="cursor-pointer gap-2 px-2 py-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-700"
            @select="handleLogout"
          >
            <LogOut class="size-4 text-current" />
            خروج از حساب
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
