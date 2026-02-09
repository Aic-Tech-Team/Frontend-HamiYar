<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { RouterLink, useRoute } from "vue-router";
import { siteConfig } from "@/config";

const route = useRoute();
const appName = siteConfig.app.name;

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
    <!-- Main Footer Content -->
    <div class="container mx-auto container-padding">
      <div class="py-6 xs:py-8 lg:py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 lg:gap-12">
          <!-- Brand Column -->
          <section class="lg:col-span-1 min-w-0">
            <div class="flex flex-col gap-4">
              <!-- Logo and Brand -->
              <div class="flex items-center gap-3">
                <img
                  src="@/assets/images/logo.svg"
                  :alt="appName"
                  class="object-contain w-14 xs:w-[70px] shrink-0"
                />
                <section class="min-w-0">
                  <h3 class="text-base xs:text-lg font-bold text-foreground">{{ appName }}</h3>
                  <p class="text-xs text-muted-foreground mt-0.5 wrap-break-word">
                    {{ siteConfig.university.fullName }}
                  </p>
                </section>
              </div>

              <p class="text-sm text-muted-foreground leading-relaxed wrap-break-word">
                سامانه یکپارچه خدماتی برای دسترسی آسان به خدمات اداری و آموزشی حامی
              </p>
            </div>
          </section>

          <!-- Quick Links Column -->
          <section class="min-w-0">
            <div class="border-b-2 pb-2 font-semibold text-foreground mb-4 text-sm xs:text-base">
              دسترسی سریع
            </div>
            <ul class="space-y-3">
              <li class="flex items-center gap-3">
                <Icon
                  icon="solar:home-2-outline"
                  class="size-4.5 text-brand-primary-600 shrink-0"
                />
                <RouterLink
                  to="/"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                >
                  صفحه اصلی
                </RouterLink>
              </li>
              <li class="flex items-center gap-3">
                <Icon
                  icon="solar:widget-5-outline"
                  class="size-4.5 text-brand-primary-600 shrink-0"
                />
                <RouterLink
                  to="/#services"
                  @click="handleHashClick('/#services', $event)"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                >
                  خدمات
                </RouterLink>
              </li>
              <li class="flex items-center gap-3">
                <Icon
                  icon="solar:headphones-round-sound-outline"
                  class="size-4.5 text-brand-primary-600 shrink-0"
                />
                <RouterLink
                  to="/#support"
                  @click="handleHashClick('/#support', $event)"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                >
                  پشتیبانی
                </RouterLink>
              </li>
            </ul>
          </section>

          <!-- Contact/Info Column -->
          <section class="min-w-0">
            <div class="border-b-2 pb-2 font-semibold text-foreground mb-4 text-sm xs:text-base">
              اطلاعات تماس
            </div>
            <ul class="space-y-3">
              <li class="flex items-start gap-3">
                <Icon
                  icon="solar:map-point-outline"
                  class="size-5 text-brand-primary-600 shrink-0"
                />

                <a
                  href="https://edu.iau.ac.ir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                >
                  {{ siteConfig.university.fullName }}
                </a>
              </li>
              <li class="flex items-center gap-3">
                <Icon
                  icon="solar:phone-calling-outline"
                  class="size-5 text-brand-primary-600 shrink-0"
                />
                <a
                  :href="`tel:+${siteConfig.contact.phone.replace(/-/g, '')}`"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                >
                  {{ siteConfig.contact.phone }}
                </a>
              </li>
              <li class="flex items-center gap-3">
                <Icon icon="solar:letter-outline" class="size-5 text-brand-primary-600 shrink-0" />
                <a
                  :href="`mailto:${siteConfig.contact.email}`"
                  class="text-sm text-muted-foreground hover:text-brand-primary-600 transition-colors duration-200"
                >
                  {{ siteConfig.contact.email }}
                </a>
              </li>
            </ul>
          </section>

          <!-- About Column -->
          <section class="min-w-0">
            <div class="border-b-2 pb-2 font-semibold text-foreground mb-4 text-sm xs:text-base">
              درباره ما
            </div>
            <p
              class="text-xs xs:text-sm text-muted-foreground leading-relaxed mb-4 wrap-break-word"
            >
              این سامانه توسط
              <span class="text-foreground font-semibold"
                >هسته فناور هوش پژوهان با همکاری دپارتمان فنی {{ siteConfig.aic.techTeam }}</span
              >
              از
              <a
                :href="siteConfig.aic.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-brand-primary-500 hover:text-brand-primary-700 font-bold transition-colors duration-200 underline-offset-4 underline"
              >
                {{ siteConfig.aic.name }}
              </a>
              توسعه یافته است.
            </p>
          </section>
        </div>
      </div>

      <!-- Bottom Bar -->
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
              :href="siteConfig.aic.website"
              target="_blank"
              rel="noopener noreferrer"
              class="text-brand-primary-600 ms-0.5 hover:text-brand-primary-700 font-bold transition-colors duration-200"
            >
              {{ siteConfig.aic.nickname }}
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
