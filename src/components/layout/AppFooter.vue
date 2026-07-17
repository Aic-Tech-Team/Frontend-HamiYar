<script setup lang="ts">
import type { Component } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { appConfig } from "@/config";
import IconMapPointOutline from "~icons/solar/map-point-outline";
import IconPhoneCallingOutline from "~icons/solar/phone-calling-outline";
import IconLetterOutline from "~icons/solar/letter-outline";

export interface FooterLink {
  label: string;
  to: string;
  icon: Component;
}

interface Props {
  links: FooterLink[];
}

defineProps<Props>();

const route = useRoute();
const appName = appConfig.app.name;

function handleHashClick(to: string, event: Event) {
  if (!to.includes("#")) return;

  const [path, hash] = to.split("#");

  if (route.path === path && hash) {
    event.preventDefault();
    document.querySelector(`#${hash}`)?.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<template>
  <footer
    class="w-full bg-background border-t-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] print:hidden overflow-x-hidden"
  >
    <div class="container mx-auto container-padding">
      <div class="py-6 xs:py-8 lg:py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 lg:gap-12">
          <section class="lg:col-span-1 min-w-0">
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <img
                  src="@/assets/images/logo.svg"
                  :alt="appName"
                  class="object-contain w-14 xs:w-17.5 shrink-0"
                />
                <section class="min-w-0">
                  <h3 class="text-base xs:text-lg font-bold text-foreground">{{ appName }}</h3>
                  <p class="text-xs text-muted-foreground mt-0.5 wrap-break-word">
                    {{ appConfig.university.name }}
                  </p>
                </section>
              </div>

              <p class="text-sm text-muted-foreground leading-relaxed wrap-break-word">
                سامانه یکپارچه خدماتی برای دسترسی آسان به خدمات اداری و آموزشی حامی
              </p>
            </div>
          </section>

          <section class="min-w-0">
            <div class="border-b-2 pb-2 font-semibold text-foreground mb-4 text-sm xs:text-base">
              دسترسی سریع
            </div>
            <ul class="space-y-3">
              <li v-for="link in links" :key="link.label" class="flex items-center gap-3">
                <component :is="link.icon" class="size-4.5 text-brand-primary-600 shrink-0" />
                <RouterLink
                  :to="link.to"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                  @click="handleHashClick(link.to, $event)"
                >
                  {{ link.label }}
                </RouterLink>
              </li>
            </ul>
          </section>

          <section class="min-w-0">
            <div class="border-b-2 pb-2 font-semibold text-foreground mb-4 text-sm xs:text-base">
              اطلاعات تماس
            </div>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <IconMapPointOutline class="size-5 text-brand-primary-600 shrink-0" />

                <a
                  href="https://edu.iau.ac.ir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                >
                  {{ appConfig.university.name }}
                </a>
              </li>
              <li class="flex items-center gap-3">
                <IconPhoneCallingOutline class="size-5 text-brand-primary-600 shrink-0" />
                <a
                  :href="`tel:+${appConfig.contact.phone.replace(/-/g, '')}`"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                >
                  {{ appConfig.contact.phone }}
                </a>
              </li>
              <li class="flex items-center gap-3">
                <IconLetterOutline class="size-5 text-brand-primary-600 shrink-0" />
                <a
                  :href="`mailto:${appConfig.contact.email}`"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                >
                  {{ appConfig.contact.email }}
                </a>
              </li>
            </ul>
          </section>

          <section class="min-w-0">
            <div class="border-b-2 pb-2 font-semibold text-foreground mb-4 text-sm xs:text-base">
              درباره ما
            </div>
            <p
              class="text-xs xs:text-sm text-muted-foreground leading-relaxed mb-4 wrap-break-word"
            >
              این سامانه توسط
              <span class="text-foreground font-semibold"
                >هسته فناور هوش پژوهان با همکاری دپارتمان فنی {{ appConfig.aic.techTeam }}</span
              >
              از
              <a
                :href="appConfig.aic.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-brand-primary-500 hover:text-brand-primary-700 font-bold transition-colors duration-200 underline-offset-4 underline"
              >
                {{ appConfig.aic.name }}
              </a>
              توسعه یافته است.
            </p>
          </section>
        </div>
      </div>

      <div class="border-t border-border py-3 xs:py-4">
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-3 xs:gap-4 text-center sm:text-start"
        >
          <div
            class="flex flex-wrap items-center justify-center gap-1 text-xs xs:text-sm text-muted-foreground"
          >
            <span>ساخته شده با</span>
            <span class="inline-block animate-heartbeat text-brand-primary-600 text-base">💜</span>
            <span>توسط</span>
            <a
              :href="appConfig.aic.website"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-primary-600 ms-0.5 hover:text-brand-primary-700 font-bold transition-colors duration-200"
            >
              {{ appConfig.aic.nickname }}
            </a>
          </div>

          <p class="text-xs text-muted-foreground shrink-0">
            © {{ new Date().getFullYear() }} {{ appName }}. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
