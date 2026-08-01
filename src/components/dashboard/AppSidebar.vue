<script setup lang="ts">
import { LayoutDashboard, LayoutGrid } from "@lucide/vue";
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

// this is a type for user for navUser
const user = {
  name: "کاربر",
  email: "",
  avatar: "",
};


const navMain = [
  {
    title: "نمای کلی",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "خدمات سامانه",
    to: "/dashboard/services",
    icon: LayoutGrid,
  },
];
</script>

<template>
  <Sidebar v-bind="props" side="right">
    <SidebarHeader>
      <HeaderSideBar />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>