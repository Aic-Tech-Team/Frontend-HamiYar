<script setup lang="ts">
import { reactive } from "vue";
import HeaderPublic from "@/layouts/HeaderPublic.vue";
import FooterSection from "@/layouts/FooterSection.vue";
import HomeHeroSection from "@/components/HomeHeroSection.vue";
import ServicesSection from "@/components/ServicesSection.vue";
import SupportSection from "@/components/SupportSection.vue";
import { Button } from "@/components/ui/button";
import { useAuthApi } from "@/composables/api/useAuthApi";
import { NavigationItem } from "@/types/footer";
import IconHome2Outline from "~icons/solar/home-2-outline";
import IconWidget5Outline from "~icons/solar/widget-5-outline";
import IconHeadphonesRoundSoundOutline from "~icons/solar/headphones-round-sound-outline";
import IconLogout3Outline from "~icons/solar/logout-3-outline";

const navigationItems = reactive<NavigationItem[]>([
  { label: "صفحه اصلی", to: "/home" },
  { label: "خدمات", to: "/home#services" },
  { label: "پشتیبانی", to: "/home#support" },
]);

const footerQuickLinks = [
  { label: "صفحه اصلی", to: "/home", icon: IconHome2Outline },
  { label: "خدمات", to: "/home#services", icon: IconWidget5Outline },
  { label: "پشتیبانی", to: "/home#support", icon: IconHeadphonesRoundSoundOutline },
];

const { logoutAsync } = useAuthApi();

function handleLogout() {
  logoutAsync();
}
</script>

<template>
  <div>
    <HeaderPublic :navigation-items="navigationItems">
      <template #actions>
        <Button variant="default" size="sm" class="gap-2 p-6" @click="handleLogout">
          خروج از حساب
          <IconLogout3Outline class="size-4" />
        </Button>
      </template>
    </HeaderPublic>
    <HomeHeroSection />

    <div class="pt-16 sm:pt-20">
      <ServicesSection class="mt-12 sm:mt-16 md:mt-24" />
      <SupportSection class="mt-12 sm:mt-16 md:mt-24" />
    </div>

    <FooterSection :quick-links="footerQuickLinks" class="mt-12 sm:mt-16 md:mt-20" />
  </div>
</template>
