<script setup lang="ts">
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import ScrollToTop from "@/components/layout/ScrollToTop.vue";
import type { NavigationItem } from "@/types/navigationItems";
import type { FooterLink } from "@/components/layout/AppFooter.vue";
import IconHome2Outline from "~icons/solar/home-2-outline";
import IconWidget5Outline from "~icons/solar/widget-5-outline";
import IconHeadphonesRoundSoundOutline from "~icons/solar/headphones-round-sound-outline";

const navItems: NavigationItem[] = [
  { label: "درباره ما", to: "/#about" },
  { label: "خدمات", to: "/#services" },
  { label: "فرآیند کار", to: "/#process" },
  { label: "پشتیبانی", to: "/#support" },
];

const footerLinks: FooterLink[] = [
  { label: "صفحه اصلی", to: "/", icon: IconHome2Outline },
  { label: "خدمات", to: "/#services", icon: IconWidget5Outline },
  { label: "فرآیند کار", to: "/#process", icon: IconWidget5Outline },
  { label: "پشتیبانی", to: "/#support", icon: IconHeadphonesRoundSoundOutline },
];
</script>

<template>
  <div class="relative flex flex-col min-h-screen">
    <AppHeader :items="navItems" action-label="شروع کنید" action-to="/login" />

    <main class="flex-1 print:p-0">
      <slot />
    </main>

    <AppFooter :links="footerLinks" />

    <ScrollToTop />
  </div>
</template>
