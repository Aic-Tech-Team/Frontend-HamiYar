<script setup lang="ts">
import LandingHero from "@/components/landing/LandingHero.vue";
import LandingWhyUs from "@/components/landing/LandingWhyUs.vue";
import LandingProcess from "@/components/landing/LandingProcess.vue";
import LandingCTA from "@/components/landing/LandingCTA.vue";
import LandingServices from "@/components/landing/LandingServices.vue";
import SupportSection from "@/components/SupportSection.vue";
</script>

<template>
  <div>
    <LandingHero />
    <LandingWhyUs />
    <LandingServices />
    <LandingProcess />
    <LandingCTA />
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :visible-once="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
    >
      <SupportSection class="w-full bg-brand-primary-50/40 lg:py-20 py-24 custom-landing-support" />
    </div>
  </div>
</template>

<style scoped>
.custom-landing-support:deep(> section:first-child) {
  display: none !important;
}
</style>
