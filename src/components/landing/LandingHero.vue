<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Button } from "@/components/ui/button";

import IconSolarSquareAcademicCapOutline from "~icons/solar/square-academic-cap-outline";
import IconSolarCardOutline from "~icons/solar/card-outline";
import IconSolarMenuDotsBold from "~icons/solar/menu-dots-bold";
import IconSolarCheckCircleBold from "~icons/solar/check-circle-bold";
</script>

<template>
  <section
    class="bg-[#FDF7FF] w-full container-padding pt-10 xs:pt-14 lg:pt-20 pb-14 lg:pb-24 overflow-x-hidden"
  >
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-stretch gap-10 lg:gap-16">
      <div
        class="flex flex-col items-center text-center lg:items-start lg:text-start gap-5 xs:gap-6"
      >
        <span
          class="inline-flex items-center gap-2 rounded-full bg-brand-primary-50 text-brand-primary-700 px-4 py-1.5 text-xs xs:text-sm font-medium"
        >
          <span class="size-1.5 rounded-full bg-emerald-500"></span>
          سامانه اتوماسیون نامه‌های اداری دانشگاه
        </span>

        <h1
          class="text-[#421A8C] text-4xl xs:text-5xl md:text-6xl font-bold leading-tight xs:leading-tight max-w-xl"
        >
          مدارک دانشگاهی دانشجویان، <span class="text-[#6425D0]">بدون صف و بدون کاغذبازی</span>
        </h1>

        <p class="text-sm xs:text-base text-muted-foreground leading-relaxed max-w-lg">
          تنها با وارد کردن اطلاعات دانشجو، نامه‌های رسمی به‌صورت خودکار تولید و آماده چاپ خواهند
          بود.
        </p>

        <div class="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 w-full xs:w-auto pt-1">
          <RouterLink to="/#services" class="w-full xs:w-auto order-2 xs:order-1">
            <Button variant="outline" size="lg" class="w-full xs:w-auto"> مشاهده خدمات </Button>
          </RouterLink>
          <RouterLink to="/login" class="w-full xs:w-auto order-1 xs:order-2">
            <Button variant="default" size="lg" class="w-full xs:w-auto gap-2">
              ثبت درخواست جدید
              <span aria-hidden="true">←</span>
            </Button>
          </RouterLink>
        </div>

        <ul class="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 pt-2">
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

      <div class="w-full flex justify-center lg:justify-center" aria-hidden="true">
        <div
          class="w-full max-w-sm xs:max-w-md h-full flex flex-col rounded-2xl border border-border bg-white shadow-xl p-4 xs:p-5"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-1.5">
              <span class="size-2 rounded-full bg-red-400"></span>
              <span class="size-2 rounded-full bg-yellow-400"></span>
              <span class="size-2 rounded-full bg-green-400"></span>
            </div>

            <div class="flex items-center gap-2 rounded-full border border-border pe-1 ps-2.5 py-1">
              <span class="text-xs font-medium text-foreground">دانشگاه آزاد اسلامی</span>
              <div
                class="size-6 rounded-md bg-brand-primary-100 flex items-center justify-center shrink-0"
              >
                <IconSolarSquareAcademicCapOutline class="size-3.5 text-brand-primary-600" />
              </div>
            </div>
          </div>

          <hr class="border-border mb-4" />

          <div class="flex items-center gap-3 mb-4">
            <div
              class="size-10 rounded-lg bg-brand-primary-100 flex items-center justify-center shrink-0"
            >
              <IconSolarCardOutline class="size-5 text-brand-primary-600" />
            </div>
            <div class="text-start min-w-0">
              <p class="text-sm font-semibold text-foreground truncate">درخواست گواهی موقت</p>
              <p class="text-xs text-muted-foreground truncate">
                علی مرادی - شماره دانشجویی 123456789
              </p>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="h-2.5 rounded-full bg-muted w-full"></div>
            <div class="h-2.5 rounded-full bg-muted w-full"></div>
          </div>

          <div
            class="mt-auto flex items-center justify-between rounded-lg border border-border bg-brand-primary-50 px-3 py-2.5"
          >
            <span class="text-xs font-medium text-brand-primary-700">در حال تأیید نهایی...</span>
            <IconSolarMenuDotsBold class="size-4 text-brand-primary-400 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
