<!-- src/components/landing/LandingHeader.vue -->
<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/config";

import IconLucideMenu from "~icons/lucide/menu";
import IconLucideX from "~icons/lucide/x";

interface NavigationItem {
  label: string;
  to: string;
}

interface Props {
  navigationItems?: NavigationItem[];
  ctaLabel?: string;
  ctaTo?: string;
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

const emit = defineEmits<{
  ctaClick: [];
}>();

const isMobileMenuOpen = ref(false);

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function handleCtaClick() {
  emit("ctaClick");
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-brand-primary-100">
    <nav
      class="flex items-center justify-between gap-4 px-4 sm:px-8 h-16 sm:h-20 max-w-7xl mx-auto"
    >
      <!-- Logo: slot with a sensible default, so a parent CAN override it, but doesn't HAVE to -->
      <RouterLink to="/" class="flex items-center gap-2 shrink-0" @click="closeMobileMenu">
        <slot name="logo">
          <img class="w-12 xs:w-14 sm:w-[65px] h-auto" src="@/assets/images/logo.svg" alt="logo" />
          <span class="font-bold text-brand-primary-900 text-2xl sm:text-base">
            {{ appConfig.app.name }}
          </span>
        </slot>
      </RouterLink>

      <!-- Desktop nav -->
      <!-- Desktop nav -->
      <ul class="hidden md:flex items-center gap-6 lg:gap-8">
        <li
          v-for="item in props.navigationItems"
          :key="item.label"
          class="text-sm lg:text-base font-medium text-brand-primary-800 hover:text-brand-primary-600 transition-colors"
        >
          <RouterLink :to="item.to" class="relative pb-1 group block">
            {{ item.label }}
            <span
              class="absolute bottom-0 right-0 w-full h-0.5 bg-brand-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-right"
            ></span>
          </RouterLink>
        </li>
      </ul>

      <!-- Right side: slot with a sensible default CTA button -->
      <div class="hidden md:flex items-center shrink-0">
        <slot name="actions">
          <RouterLink :to="props.ctaTo">
            <Button
              variant="default"
              size="sm"
              class="h-9! sm:h-11! sm:px-4!"
              @click="handleCtaClick"
            >
              {{ props.ctaLabel }}
            </Button>
          </RouterLink>
        </slot>
      </div>

      <!-- Mobile hamburger toggle -->
      <button
        class="md:hidden relative inline-flex items-center justify-center size-10 text-brand-primary-900 overflow-hidden"
        :aria-label="isMobileMenuOpen ? 'بستن منو' : 'باز کردن منو'"
        @click="toggleMobileMenu"
      >
        <IconLucideMenu
          class="size-6 absolute transition-all duration-300 ease-in-out"
          :class="
            isMobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          "
        />
        <IconLucideX
          class="size-6 absolute transition-all duration-300 ease-in-out"
          :class="
            isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          "
        />
      </button>
    </nav>

    <!-- Mobile menu panel -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden px-4 pb-4 border-t border-brand-primary-100">
        <ul class="flex flex-col gap-3 pt-4">
          <li v-for="item in props.navigationItems" :key="item.label">
            <RouterLink
              :to="item.to"
              class="block text-brand-primary-800 font-medium py-1"
              @click="closeMobileMenu"
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
        <div class="mt-4">
          <slot name="actions">
            <RouterLink :to="props.ctaTo" class="block" @click="closeMobileMenu">
              <Button variant="default" size="sm" class="w-full" @click="handleCtaClick">
                {{ props.ctaLabel }}
              </Button>
            </RouterLink>
          </slot>
        </div>
      </div>
    </Transition>
  </header>
</template>
