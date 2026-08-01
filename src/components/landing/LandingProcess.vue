<script setup lang="ts">
import { ref } from "vue";
import IconSolarUserCheckOutline from "~icons/solar/user-check-outline";
import IconSolarPenNewSquareOutline from "~icons/solar/pen-new-square-outline";
import IconSolarDocumentTextOutline from "~icons/solar/document-text-outline";
import IconSolarPlainOutline from "~icons/solar/plain-outline";
import { useElementVisibility } from "@vueuse/core";

const sectionRef = ref<HTMLElement | null>(null);
const isSectionVisible = useElementVisibility(sectionRef);

const steps = [
  {
    number: "۱",
    icon: IconSolarUserCheckOutline,
    title: "بررسی اطلاعات کاربر",
    description: "درخواست ارسال‌شده توسط کاربر بررسی و اطلاعات موردنیاز تأیید می‌شود.",
    boxClass: "bg-brand-primary-600 border-2 border-border shadow-sm shadow-brand-primary-600/30",
    iconClass: "text-white",
    badgeClass: "bg-brand-primary-600 text-white",
  },
  {
    number: "۲",
    icon: IconSolarPenNewSquareOutline,
    title: "ثبت اطلاعات",
    description: "اطلاعات کاربر در سامانه وارد شده و نوع نامه موردنظر انتخاب می‌شود.",
    boxClass: "bg-brand-primary-100 border-2 border-border shadow-sm",
    iconClass: "text-brand-primary-600",
    badgeClass: "bg-brand-primary-600 text-white",
  },
  {
    number: "۳",
    icon: IconSolarDocumentTextOutline,
    title: "تولید خودکار نامه",
    description: "سامانه نامه را بر اساس اطلاعات ثبت‌شده و قالب‌های رسمی دانشگاه تولید می‌کند.",
    boxClass: "bg-brand-primary-100 border-2 border-border shadow-sm",
    iconClass: "text-brand-primary-600",
    badgeClass: "bg-brand-primary-600 text-white",
  },
  {
    number: "۴",
    icon: IconSolarPlainOutline,
    title: "ارسال برای کاربر",
    description: "فایل نهایی برای کاربر ارسال شده یا جهت چاپ در اختیار واحد مربوطه قرار می‌گیرد.",
    boxClass: "bg-white border-2 border-border shadow-sm",
    iconClass: "text-muted-foreground",
    badgeClass: "bg-brand-primary-200 text-brand-primary-700",
  },
];
</script>

<template>
  <section
    ref="sectionRef"
    id="process"
    class="bg-brand-primary-50 w-full container-padding py-14 lg:py-20 -z-20"
  >
    <div
      :key="isSectionVisible ? 'in-view' : 'out-of-view'"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      class="max-w-5xl mx-auto text-center mb-14 lg:mb-16"
    >
      <p class="text-xs xs:text-sm font-medium text-brand-primary-600 mb-2">فرآیند صدور نامه</p>

      <h2 class="text-2xl xs:text-3xl md:text-4xl font-bold text-brand-primary-700 mb-4">
        صدور نامه در چهار مرحله ساده
      </h2>

      <p class="text-sm xs:text-base text-muted-foreground">
        از بررسی درخواست تا ارسال نامه، همه مراحل در یک سامانه انجام می‌شود.
      </p>
    </div>

    <div class="max-w-6xl mx-auto relative">
      <div
        v-motion
        :initial="{ scaleX: 0 }"
        :visible-once="{ scaleX: 1, transition: { duration: 900, delay: 200 } }"
        class="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] border-t border-brand-primary-700 origin-right"
      ></div>

      <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 130 } }"
          class="flex flex-col items-center text-center gap-4"
        >
          <div class="relative">
            <div
              v-motion
              :initial="{ scale: 1, y: 0 }"
              :hovered="{ scale: 1.08, y: -4 }"
              :class="step.boxClass"
              class="size-16 rounded-2xl flex items-center justify-center"
            >
              <component :is="step.icon" class="size-6" :class="step.iconClass" />
            </div>

            <span
              :class="step.badgeClass"
              class="absolute -top-2 -right-2 size-6 rounded-full text-xs font-bold flex items-center justify-center shadow"
            >
              {{ step.number }}
            </span>
          </div>

          <h3 class="text-base xs:text-lg font-semibold text-foreground">
            {{ step.title }}
          </h3>

          <p class="text-xs xs:text-sm text-muted-foreground leading-relaxed max-w-[200px]">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
