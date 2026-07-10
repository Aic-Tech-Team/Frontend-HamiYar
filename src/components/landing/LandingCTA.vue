<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";

import IconSolarShieldCheckOutline from "~icons/solar/shield-check-outline";
</script>

<template>
  <section class="w-full py-12 lg:py-20 flex-center container-padding">
    <div
      class="cta-banner relative w-full max-w-5xl rounded-[2.5rem] bg-brand-primary-600 p-8 md:p-12 lg:p-16 flex flex-col items-center text-center overflow-hidden"
    >
      <div
        class="glow-circle-tr absolute -top-24 -right-24 size-72 md:size-96 rounded-full bg-brand-primary-300/70 blur-[50px] md:blur-[70px] pointer-events-none"
      ></div>

      <div
        class="glow-circle-bl absolute -bottom-28 -left-28 size-80 md:size-[28rem] rounded-full bg-brand-primary-400/60 blur-[60px] md:blur-[80px] pointer-events-none"
      ></div>

      <div class="relative z-10 flex flex-col items-center">
        <div
          class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 mb-6 md:mb-8"
        >
          <IconSolarShieldCheckOutline class="size-4 text-white" />
          <span class="text-xs md:text-sm font-medium text-white">
            رایگان – بدون نیاز به حضور فیزیکی
          </span>
        </div>

        <h2
          class="text-white text-3xl sm:text-4xl md:text-5xl font-bold leading-tight md:leading-tight max-w-3xl mb-4 md:mb-6"
        >
          همین امروز فرآیندهای دانشگاهی خود را متحول کنید
        </h2>

        <p
          class="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mb-8 md:mb-12 leading-relaxed"
        >
          به بیش از ۵۰,۰۰۰ دانشجوی فعال در سامانه حامی یار بپیوندید و تجربه ای نوین داشته باشید.
        </p>

        <RouterLink to="/login">
          <Button
            size="lg"
            class="bg-white hover:bg-brand-primary-50 text-brand-primary-600 rounded-full px-8 h-12 sm:h-14 text-sm sm:text-base font-bold flex-center gap-2 transition-all active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
          >
            عضویت در سامانه
            <span aria-hidden="true" class="text-lg leading-none">&larr;</span>
          </Button>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes pulseGlow {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.9;
  }
}

.glow-circle-tr {
  animation: pulseGlow 7s ease-in-out infinite;
}

.glow-circle-bl {
  animation: pulseGlow 9s ease-in-out infinite;
}

.cta-banner {
  box-shadow: 0 30px 60px -15px rgba(83, 33, 180, 0.4);
  transition:
    transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.4s ease;
}

@media (min-width: 1024px) {
  .cta-banner:hover {
    transform: translateY(-4px);
    box-shadow: 0 40px 80px -20px rgba(83, 33, 180, 0.55);
  }
}
</style>
