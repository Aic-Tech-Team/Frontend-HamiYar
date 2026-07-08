<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
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
const isScrolled = ref(false);
const isHidden = ref(false);

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function handleCtaClick() {
  emit("ctaClick");
}

function handleScroll() {
  const currentScrollTop = window.scrollY;

  if (currentScrollTop > 200) {
    isScrolled.value = true;
    isHidden.value = false;
  } else if (currentScrollTop > 60) {
    isScrolled.value = false;
    isHidden.value = true;
    isMobileMenuOpen.value = false;
  } else {
    isScrolled.value = false;
    isHidden.value = false;
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out bg-white/90 backdrop-blur-sm"
    :class="[
      isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100',
      isScrolled
        ? 'shadow-md border-b border-brand-primary-100/60 bg-white/95'
        : 'border-b border-brand-primary-100',
    ]"
  >
    <nav
      class="flex items-center justify-between gap-4 px-4 sm:px-8 max-w-7xl mx-auto transition-all duration-300"
      :class="isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'"
    >
      <RouterLink to="/" class="flex items-center gap-2 shrink-0" @click="closeMobileMenu">
        <slot name="logo">
          <img
            class="transition-all duration-300 h-auto"
            :class="isScrolled ? 'w-10 xs:w-12 sm:w-[50px]' : 'w-12 xs:w-14 sm:w-[65px]'"
            src="@/assets/images/logo.svg"
            alt="logo"
          />
          <span
            class="font-bold text-brand-primary-900 transition-all duration-300"
            :class="isScrolled ? 'text-xl sm:text-sm' : 'text-2xl sm:text-base'"
          >
            {{ appConfig.app.name }}
          </span>
        </slot>
      </RouterLink>

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

      <div class="hidden md:flex items-center shrink-0">
        <slot name="actions">
          <RouterLink :to="props.ctaTo">
            <Button
              variant="default"
              class="sm:px-4! transition-all duration-300"
              :class="isScrolled ? 'h-8! sm:h-9!' : 'h-9! sm:h-11!'"
              @click="handleCtaClick"
            >
              {{ props.ctaLabel }}
            </Button>
          </RouterLink>
        </slot>
      </div>

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

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden px-4 pb-4 border-t border-brand-primary-100 bg-white/95 backdrop-blur-sm"
      >
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
