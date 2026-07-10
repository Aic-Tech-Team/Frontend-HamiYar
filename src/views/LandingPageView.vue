<script setup lang="ts">
import { reactive } from "vue";
import HeaderPublic from "@/layouts/HeaderPublic.vue";
import FooterSection from "@/layouts/FooterSection.vue";
import LandingHero from "@/components/landing/LandingHero.vue";
import LandingWhyUs from "@/components/landing/LandingWhyUs.vue";
import LandingProcess from "@/components/landing/LandingProcess.vue";
import LandingCTA from "@/components/landing/LandingCTA.vue";
import LandingServices from "@/components/landing/LandingServices.vue";
import SupportSection from "@/components/SupportSection.vue";
import { NavigationItem } from "@/types/navitems";
import IconHome2Outline from "~icons/solar/home-2-outline";
import IconWidget5Outline from "~icons/solar/widget-5-outline";
import IconHeadphonesRoundSoundOutline from "~icons/solar/headphones-round-sound-outline";

const navigationItems = reactive<NavigationItem[]>([
  { label: "درباره ما", to: "/#about" },
  { label: "خدمات", to: "/#services" },
  { label: "فرآیند کار", to: "/#process" },
  { label: "پشتیبانی", to: "/#support" },
]);


const footerQuickLinks = [
  { label: "صفحه اصلی", to: "/", icon: IconHome2Outline },
  { label: "خدمات", to: "/#services", icon: IconWidget5Outline },
  { label: "فرآیند کار", to: "/#process", icon: IconWidget5Outline },
  { label: "پشتیبانی", to: "/#support", icon: IconHeadphonesRoundSoundOutline },
];
</script>

<template>
  <div>
    <HeaderPublic :navigation-items="navigationItems" cta-label="شروع کنید" cta-to="/login" />

    <LandingHero />
    <LandingWhyUs />
    <LandingServices />
    <LandingProcess />
    <LandingCTA />
    <SupportSection class="w-full bg-brand-primary-50/40 py-16 mt-12 custom-landing-support" />

    <FooterSection :quick-links="footerQuickLinks" />
  </div>
</template>

<style scoped>
.custom-landing-support:deep(> section:first-child) {
  display: none !important;
}
</style>
