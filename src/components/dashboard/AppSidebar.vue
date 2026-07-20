<script setup lang="ts">
import { Bot, Settings2, SquareTerminal } from "@lucide/vue";
import NavMain from "@/components/dashboard/NavMain.vue";
import NavUser from "@/components/dashboard/NavUser.vue";
import HeaderSideBar from "@/components/dashboard/HeaderSideBar.vue";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
const props = withDefaults(
  defineProps<{
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
    class?: any;
  }>(),
  {
    collapsible: "icon",
  },
);
// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props" side="right">
    <SidebarHeader>
      <HeaderSideBar />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
