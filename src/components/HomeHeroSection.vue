<script setup lang="ts">
import { appConfig } from "@/config";
</script>
 
<template>
  <section
    class="relative px-4 xs:px-6 sm:px-10 mt-15 xs:mt-16 sm:mt-20 rounded-b-3xl sm:rounded-b-[4rem] border-b-3 border-brand-primary-200 overflow-hidden bg-brand-primary-100/75"
    style="
      background: linear-gradient(
        135deg,
        rgba(240, 235, 249, 0.95) 0%,
        rgba(226, 217, 244, 0.9) 50%,
        rgba(197, 179, 233, 0.85) 100%
      );
    "
  >
    <!-- Modern Persian-Inspired Geometric Pattern -->
    <svg
      class="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="modern-persian-pattern"
          x="0"
          y="0"
          width="80"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="40" x2="80" y2="40" stroke="#5321b4" stroke-width="0.5" stroke-opacity="0.5" />
          <line x1="40" y1="0" x2="40" y2="80" stroke="#5321b4" stroke-width="0.5" stroke-opacity="0.5" />
 
          <g transform="translate(40, 40)">
            <polygon
              points="0,-12 10.4,-6 10.4,6 0,12 -10.4,6 -10.4,-6"
              fill="none"
              stroke="#5321b4"
              stroke-width="1"
              stroke-opacity="0.5"
            />
            <polygon
              points="0,-6 5.2,-3 5.2,3 0,6 -5.2,3 -5.2,-3"
              fill="none"
              stroke="#6a32d9"
              stroke-width="0.6"
              stroke-opacity="0.5"
            />
            <circle cx="0" cy="0" r="1.5" fill="#5321b4" fill-opacity="0.5" />
          </g>
 
          <g transform="translate(20, 20)">
            <circle cx="0" cy="0" r="2" fill="#5321b4" fill-opacity="0.5" />
            <polygon
              points="0,-3 2.6,-1.5 2.6,1.5 0,3 -2.6,1.5 -2.6,-1.5"
              fill="none"
              stroke="#6a32d9"
              stroke-width="0.4"
              stroke-opacity="0.5"
            />
          </g>
 
          <g transform="translate(60, 20)">
            <circle cx="0" cy="0" r="2" fill="#5321b4" fill-opacity="0.5" />
            <polygon
              points="0,-3 2.6,-1.5 2.6,1.5 0,3 -2.6,1.5 -2.6,-1.5"
              fill="none"
              stroke="#6a32d9"
              stroke-width="0.4"
              stroke-opacity="0.5"
            />
          </g>
 
          <g transform="translate(20, 60)">
            <circle cx="0" cy="0" r="2" fill="#5321b4" fill-opacity="0.5" />
            <polygon
              points="0,-3 2.6,-1.5 2.6,1.5 0,3 -2.6,1.5 -2.6,-1.5"
              fill="none"
              stroke="#6a32d9"
              stroke-width="0.4"
              stroke-opacity="0.5"
            />
          </g>
 
          <g transform="translate(60, 60)">
            <circle cx="0" cy="0" r="2" fill="#5321b4" fill-opacity="0.5" />
            <polygon
              points="0,-3 2.6,-1.5 2.6,1.5 0,3 -2.6,1.5 -2.6,-1.5"
              fill="none"
              stroke="#6a32d9"
              stroke-width="0.4"
              stroke-opacity="0.5"
            />
          </g>
 
          <line x1="0" y1="0" x2="40" y2="40" stroke="#5321b4" stroke-width="0.3" stroke-opacity="0.08" />
          <line x1="80" y1="0" x2="40" y2="40" stroke="#5321b4" stroke-width="0.3" stroke-opacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#modern-persian-pattern)" />
    </svg>
 
    <!-- Gradient Blob Decorations -->
    <div
      class="absolute top-0 right-0 w-100 h-100 rounded-full opacity-40 blur-3xl pointer-events-none"
      style="
        background: radial-gradient(
          circle,
          rgba(106, 50, 217, 0.6) 0%,
          rgba(83, 33, 180, 0.4) 40%,
          rgba(83, 33, 180, 0.2) 60%,
          transparent 80%
        );
        transform: translate(30%, -30%);
      "
    ></div>
    <div
      class="absolute bottom-0 left-0 w-150 h-150 rounded-full opacity-35 blur-3xl pointer-events-none"
      style="
        background: radial-gradient(
          circle,
          rgba(136, 91, 225, 0.5) 0%,
          rgba(106, 50, 217, 0.3) 40%,
          rgba(106, 50, 217, 0.15) 60%,
          transparent 80%
        );
        transform: translate(-25%, 25%);
      "
    ></div>
 

    <section class="relative z-10 flex-col-center pt-16 sm:pt-20 pb-10 sm:pb-16 md:pb-20 px-2">
      <section class="text-center w-full min-w-0">
        <section class="w-fit mx-auto mb-6 sm:mb-10">
          <h1 class="text-3xl xs:text-4xl sm:text-5xl font-bold text-brand-primary-900 wrap-break-word">
            {{ appConfig.app.name }}
          </h1>
        </section>
        <p class="text-brand-primary-800 max-w-2xl mx-auto text-base sm:text-lg px-1">
          به سامانه یکپارچه خدماتی حامی یار {{ appConfig.university.name }} خوش آمدید. از طریق این
          سامانه میتوانید به خدمات اداری حامی دسترسی داشته باشید.
        </p>
      </section>
    </section>
  </section>
</template>