<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import { useMotion } from "@vueuse/motion";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/config";
import type { NavigationItem } from "@/types/navigationItems";

import IconLucideMenu from "~icons/lucide/menu";
import IconLucideX from "~icons/lucide/x";

interface Props {
  items?: NavigationItem[];
  actionLabel?: string;
  actionTo?: string;
}

withDefaults(defineProps<Props>(), {
  actionLabel: "شروع کنید",
  actionTo: "/login",
});

const emit = defineEmits<{
  actionClick: [];
}>();

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}

function handleActionClick() {
  emit("actionClick");
}

const headerEl = ref<HTMLElement | null>(null);
const { variant: headerVariant } = useMotion(headerEl, {
  top: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    transition: { duration: 250, type: "tween", ease: "easeInOut" },
  },
  scrolled: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: { duration: 250, type: "tween", ease: "easeInOut" },
  },
});

const COMPACT_THRESHOLD = 60;

function handleScroll() {
  isScrolled.value = window.scrollY > COMPACT_THRESHOLD;
  headerVariant.value = isScrolled.value ? "scrolled" : "top";
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <header
    ref="headerEl"
    class="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-sm"
    :class="
      isScrolled ? 'border-b border-brand-primary-100/60' : 'border-b border-brand-primary-100'
    "
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
          <section class="min-w-0">
            <span
              class="font-bold text-brand-primary-900 transition-all duration-300"
              :class="isScrolled ? 'text-lg sm:text-lg' : 'text-lg sm:text-xl'"
            >
              {{ appConfig.app.name }}
            </span>
            <p
              class="mt-0.5 text-muted-foreground transition-all duration-300 ease-in-out"
              :class="
                isScrolled ? 'text-xs sm:text-xs leading-3' : 'text-xs sm:text-sm leading-4'
              "
            >
              {{ appConfig.university.name }}
            </p>
          </section>
        </slot>
      </RouterLink>

      <ul class="hidden md:flex items-center gap-6 lg:gap-8">
        <li
          v-for="item in items"
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
          <RouterLink :to="actionTo">
            <Button
              v-motion
              :initial="{ scale: 1 }"
              :hovered="{ scale: 1.05 }"
              :tapped="{ scale: 0.96 }"
              variant="default"
              class="sm:px-4! transition-all duration-300"
              :class="isScrolled ? 'h-8! sm:h-9!' : 'h-9! sm:h-11!'"
              @click="handleActionClick"
            >
              {{ actionLabel }}
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
          <li v-for="item in items" :key="item.label">
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
            <RouterLink :to="actionTo" class="block" @click="closeMobileMenu">
              <Button
                v-motion
                :initial="{ scale: 1 }"
                :tapped="{ scale: 0.96 }"
                variant="default"
                size="sm"
                class="w-full"
                @click="handleActionClick"
              >
                {{ actionLabel }}
              </Button>
            </RouterLink>
          </slot>
        </div>
      </div>
    </Transition>
  </header>
</template>
