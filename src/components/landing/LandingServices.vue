<script setup lang="ts">
import { services } from "@/constants/services";
</script>

<template>
  <section id="services" class="w-full container-padding py-14 lg:py-20 scroll-mt-20">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      class="max-w-5xl mx-auto text-center mb-14 lg:mb-16"
    >
      <p class="text-xs xs:text-sm font-medium text-brand-primary-600 mb-2">خدمات سامانه</p>
      <h2 class="text-2xl xs:text-3xl md:text-4xl font-bold text-brand-primary-700 mb-4">
        هر مدرکی که نیاز دارید، یک‌جا
      </h2>
      <p class="text-sm xs:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        دسترسی سریع و آسان به تمامی اسناد تحصیلی مورد نیاز شما در یک پلتفرم جامع.
      </p>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xs:gap-6">
      <div
        v-for="(service, index) in services"
        :key="service.id"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
        :hovered="{ y: -6, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }"
        class="rounded-2xl bg-brand-primary-50/40 border border-border shadow-sm p-5 xs:p-6 text-start"
      >
        <div
          class="size-11 xs:size-12 rounded-xl bg-brand-primary-100/60 flex items-center justify-center mb-4"
        >
          <component :is="service.icon" class="size-5 xs:size-6 text-brand-primary-600" />
        </div>

        <h3 class="text-base xs:text-lg font-semibold text-brand-primary-700 mb-2">
          {{ service.title }}
        </h3>

        <p class="text-xs xs:text-sm text-muted-foreground leading-relaxed">
          {{ service.description }}
        </p>
      </div>
    </div>
  </section>
</template>