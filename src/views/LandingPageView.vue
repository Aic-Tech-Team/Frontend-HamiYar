<script setup lang="ts">
import HeaderPublic from "@/layouts/HeaderPublic.vue";

interface Props {
  navigationItems?: NavigationItem[];
  ctaLabel?: string;
  ctaTo?: string;
}

interface NavigationItem {
  label: string;
  to: string;
}
const props = withDefaults(defineProps<Props>(), {
  navigationItems: () => [
    { label: "خدمات", to: "/#services" },
    { label: "فرآیند کار", to: "/#process" },
    { label: "پشتیبانی", to: "/#support" },
    { label: "درباره ما", to: "/#about" },
  ],
  ctaLabel: "شروع کنید",
  ctaTo: "/login",
});
</script>

<template>
  <HeaderPublic
    :navigation-items="props.navigationItems"
    :cta-label="props.ctaLabel"
    :cta-to="props.ctaTo"
  />
  
</template>
