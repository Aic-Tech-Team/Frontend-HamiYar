<script setup lang="ts">
import { reactive } from "vue";
import HeaderPublic from "@/layouts/HeaderPublic.vue";
import LandingHero from "@/components/landing/LandingHero.vue";

interface NavigationItem {
  label: string;
  to: string;
}

const navigationItems = reactive<NavigationItem[]>([
  { label: "خدمات", to: "/#services" },
  { label: "فرآیند کار", to: "/#process" },
  { label: "پشتیبانی", to: "/#support" },
  { label: "درباره ما", to: "/#about" },
]);
</script>

<template>
  <div>
    <HeaderPublic 
    :navigation-items="navigationItems" 
    cta-label="شروع کنید" 
    cta-to="/login" 
    />

    <LandingHero />
  </div>
</template>
