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
    <div class="max-w-3xl mx-auto text-center mb-14">
      <h2 class="text-3xl md:text-4xl font-bold text-brand-primary-700 mb-5">چرا این سامانه؟</h2>
 
      <p class="text-sm md:text-base text-muted-foreground leading-8 max-w-2xl mx-auto">
        این سامانه با هدف کاهش زمان صدور نامه‌های اداری، افزایش دقت و یکپارچه‌سازی فرآیندهای
        آموزشی طراحی شده است تا کارشناسان دانشگاه بتوانند درخواست‌های دانشجویان را سریع‌تر و با
        خطای کمتر مدیریت کنند.
      </p>
    </div>
 
    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
      <div
        v-for="item in whyUsItems"
        :key="item.title"
        class="flex flex-col items-center text-center"
      >
        <div
          class="size-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-5"
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