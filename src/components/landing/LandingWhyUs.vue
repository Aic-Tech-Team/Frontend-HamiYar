<script setup lang="ts">
import IconSolarClockCircleOutline from "~icons/solar/clock-circle-outline";
import IconSolarDocumentTextOutline from "~icons/solar/document-text-outline";
import IconSolarShieldCheckOutline from "~icons/solar/shield-check-outline";
import IconSolarFolderOpenOutline from "~icons/solar/folder-open-outline";

const whyUsItems = [
  {
    icon: IconSolarClockCircleOutline,
    title: "صدور سریع نامه‌ها",
    description:
      "تنها با وارد کردن اطلاعات دانشجو، انواع نامه‌های اداری در چند ثانیه تولید و آماده چاپ خواهند بود.",
  },
  {
    icon: IconSolarDocumentTextOutline,
    title: "قالب‌های استاندارد",
    description:
      "تمامی نامه‌ها مطابق قالب‌های رسمی دانشگاه تولید می‌شوند و نیازی به ویرایش یا تنظیمات دستی ندارند.",
  },
  {
    icon: IconSolarShieldCheckOutline,
    title: "کاهش خطای انسانی",
    description:
      "تولید خودکار نامه‌ها بر اساس اطلاعات ثبت‌شده، احتمال خطاهای تایپی و مغایرت اطلاعات را به حداقل می‌رساند.",
  },
  {
    icon: IconSolarFolderOpenOutline,
    title: "مدیریت یکپارچه",
    description:
      "درخواست‌ها و نامه‌های صادرشده در یک محیط واحد ثبت، جستجو و مدیریت می‌شوند.",
  },
];
</script>

<template>
  <section id="about" class="w-full bg-brand-primary-50 container-padding py-16 lg:py-24">
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      class="max-w-3xl mx-auto text-center mb-14"
    >
      <h2 class="text-3xl md:text-4xl font-bold text-brand-primary-700 mb-5">چرا سامانه حامیار؟</h2>

      <p class="text-sm md:text-base text-muted-foreground leading-8 max-w-2xl mx-auto">
        این سامانه با هدف کاهش زمان صدور نامه‌های اداری، افزایش دقت و یکپارچه‌سازی فرآیندهای
        آموزشی طراحی شده است تا کارشناسان دانشگاه بتوانند درخواست‌های دانشجویان را سریع‌تر و با
        خطای کمتر مدیریت کنند.
      </p>
    </div>

    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
      <div
        v-for="(item, index) in whyUsItems"
        :key="item.title"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100 } }"
        class="flex flex-col items-center text-center"
      >
        <div
          v-motion
          :initial="{ scale: 1, y: 0 }"
          :hovered="{ scale: 1.08, y: -4 }"
          class="size-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-5 transition-shadow duration-300 hover:shadow-xl"
        >
          <component :is="item.icon" class="size-8 text-brand-primary-500" />
        </div>

        <h3 class="text-lg font-semibold text-brand-primary-700 mb-3">
          {{ item.title }}
        </h3>

        <p class="text-sm text-muted-foreground leading-7 max-w-[260px]">
          {{ item.description }}
        </p>
      </div>
    </div>
  </section>
</template>