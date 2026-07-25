<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import Typewriter from "typewriter-effect/dist/core";
import { Button } from "@/components/ui/button";

import IconSolarSquareAcademicCapOutline from "~icons/solar/square-academic-cap-outline";
import IconSolarCardOutline from "~icons/solar/card-outline";
import IconSolarMenuDotsBold from "~icons/solar/menu-dots-bold";
import IconSolarCheckCircleBold from "~icons/solar/check-circle-bold";
import { ArrowLeft } from "@lucide/vue";

const typedTargetEl = ref<HTMLElement | null>(null);
let typewriterInstance: InstanceType<typeof Typewriter> | null = null;

onMounted(() => {
  if (!typedTargetEl.value) return;

  typewriterInstance = new Typewriter(typedTargetEl.value, {
    delay: 65,
    deleteSpeed: 35,
    loop: true,
  });

  typewriterInstance
    .typeString(
      'مدارک دانشگاهی شما، <span class="text-brand-primary-500">بدون صف و بدون کاغذبازی</span>',
    )
    .pauseFor(2200)
    .deleteAll()
    .typeString("از درخواست تا دریافت مدرک، همه‌چیز فقط چند کلیک فاصله دارد")
    .pauseFor(2200)
    .deleteAll()
    .start();
});

onUnmounted(() => {
  typewriterInstance?.stop();
});
</script>

<template>
  <section
    class="bg-brand-primary-50/25 sm:mt-16 w-full container-padding pt-10 mt-15 xs:pt-14 lg:pt-20 pb-14 lg:pb-24 overflow-x-hidden"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
      <div
        class="flex flex-col items-center text-center lg:items-start lg:text-start gap-5 xs:gap-6"
      >
        <span
          v-motion
          :initial="{ opacity: 0, y: -10 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 100, duration: 500 } }"
          class="inline-flex items-center gap-2 rounded-full bg-brand-primary-50 text-brand-primary-700 px-4 py-1.5 text-xs xs:text-sm font-medium"
        >
          <span class="size-1.5 rounded-full bg-emerald-500"></span>
          ویژه دانشجویان و دانش‌آموختگان
        </span>

        <h1
          v-motion
          :initial="{ opacity: 0, y: 16 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 600 } }"
          class="text-primary text-3xl xs:text-4xl md:text-5xl font-bold leading-tight xs:leading-tight max-w-xl min-h-[3.3em]"
        >
          <span ref="typedTargetEl"></span>
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, y: 16 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 600 } }"
          class="text-sm xs:text-base text-muted-foreground leading-relaxed max-w-lg"
        >
          سامانه‌ای هوشمند برای ثبت، پیگیری و مدیریت درخواست‌های آموزشی که فرآیند دریافت مدارک
          دانشگاهی را ساده، سریع و کاملاً آنلاین می‌کند.
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, y: 16 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 600 } }"
          class="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 w-full xs:w-auto pt-1"
        >
          <RouterLink to="/#services" class="w-full xs:w-auto order-2 xs:order-1">
            <Button
              v-motion
              :initial="{ scale: 1 }"
              :hovered="{ scale: 1.04 }"
              :tapped="{ scale: 0.97 }"
              variant="outline"
              size="lg"
              class="w-full xs:w-auto"
            >
              مشاهده خدمات
            </Button>
          </RouterLink>
          <RouterLink to="/login" class="w-full xs:w-auto order-1 xs:order-2">
            <Button
              v-motion
              :initial="{ scale: 1 }"
              :hovered="{ scale: 1.04 }"
              :tapped="{ scale: 0.97 }"
              variant="default"
              size="lg"
              class="w-full xs:w-auto gap-2"
            >
              ثبت درخواست جدید
              <ArrowLeft class="size-4" aria-hidden="true" />
            </Button>
          </RouterLink>
        </div>

        <ul
          v-motion
          :initial="{ opacity: 0, y: 16 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 500, duration: 600 } }"
          class="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 pt-2"
        >
          <li class="flex items-center gap-1.5 text-xs xs:text-sm text-muted-foreground">
            مورد تأیید رسمی دانشگاه
            <IconSolarCheckCircleBold class="size-4 text-emerald-500 shrink-0" />
          </li>
          <li class="flex items-center gap-1.5 text-xs xs:text-sm text-muted-foreground">
            پیگیری آنلاین وضعیت
            <IconSolarCheckCircleBold class="size-4 text-emerald-500 shrink-0" />
          </li>
          <li class="flex items-center gap-1.5 text-xs xs:text-sm text-muted-foreground">
            صدور سریع مدارک
            <IconSolarCheckCircleBold class="size-4 text-emerald-500 shrink-0" />
          </li>
        </ul>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.92 }"
        :enter="{ opacity: 1, scale: 1, transition: { delay: 250, duration: 700 } }"
        class="w-full flex justify-center lg:justify-end pt-4 lg:pt-0"
        aria-hidden="true"
      >
        <div
          class="floating-card w-full sm:w-[80%] lg:max-w-md aspect-square lg:aspect-[4/5] flex flex-col rounded-2xl border border-border bg-white p-5 xs:p-7"
        >
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-1.5">
              <span class="size-3 rounded-full bg-red-400"></span>
              <span class="size-3 rounded-full bg-yellow-400"></span>
              <span class="size-3 rounded-full bg-green-400"></span>
            </div>

            <div class="flex items-center gap-2 rounded-full border border-border pe-1 ps-3 py-1.5">
              <span class="text-xs font-medium text-foreground">دانشگاه آزاد اسلامی</span>
              <div
                class="size-6 rounded-md bg-brand-primary-100 flex items-center justify-center shrink-0"
              >
                <IconSolarSquareAcademicCapOutline class="size-3.5 text-brand-primary-600" />
              </div>
            </div>
          </div>

          <hr class="border-border mb-5" />

          <div class="flex items-center gap-4 mb-6">
            <div
              class="size-12 rounded-xl bg-brand-primary-100 flex items-center justify-center shrink-0"
            >
              <IconSolarCardOutline class="size-6 text-brand-primary-600" />
            </div>
            <div class="text-start min-w-0">
              <p class="text-base font-semibold text-foreground truncate">درخواست گواهی موقت</p>
              <p class="text-sm text-muted-foreground truncate mt-0.5">
                علی مرادی - شماره دانشجویی 123456789
              </p>
            </div>
          </div>

          <div class="space-y-3 mb-8">
            <div class="h-3 rounded-full bg-muted w-full"></div>
            <div class="h-3 rounded-full bg-muted w-4/5"></div>
          </div>

          <div
            class="mt-auto flex items-center justify-between rounded-xl border border-brand-primary-100 bg-brand-primary-50 px-4 py-3"
          >
            <span class="text-sm font-bold text-brand-primary-700">در حال تأیید نهایی...</span>
            <IconSolarMenuDotsBold class="size-5 text-brand-primary-400 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0px);
  }
}

.floating-card {
  animation: float 6s ease-in-out infinite;

  box-shadow: 0 20px 40px -10px rgba(100, 37, 208, 0.15);

  transition: all 0.3s ease;
}

.floating-card:hover {
  box-shadow: 0 30px 50px -15px rgba(100, 37, 208, 0.25);
}
</style>
