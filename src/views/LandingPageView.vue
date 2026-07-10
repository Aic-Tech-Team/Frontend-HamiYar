<script setup lang="ts">
import { reactive } from "vue";
import HeaderPublic from "@/layouts/HeaderPublic.vue";
import LandingHero from "@/components/landing/LandingHero.vue";
import LandingWhyUs from "@/components/landing/LandingWhyUs.vue";

import LandingCTA from "@/components/landing/LandingCTA.vue";

import LandingServices from "@/components/landing/LandingServices.vue";


interface NavigationItem {
  label: string;
  to: string;
}

const navigationItems = reactive<NavigationItem[]>([
  { label: "درباره ما", to: "/#about" },
  { label: "خدمات", to: "/#services" },
  { label: "فرآیند کار", to: "/#process" },
  { label: "پشتیبانی", to: "/#support" },
]);
</script>

<template>
  <div>
    <HeaderPublic :navigation-items="navigationItems" cta-label="شروع کنید" cta-to="/login" />

    <LandingHero />
    <LandingWhyUs />

    <LandingCTA />

    <LandingServices />

  </div>
</template>
