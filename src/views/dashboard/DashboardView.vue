<script setup lang="ts">
import { appConfig } from "@/config";
import ServicesSection from "@/components/ServicesSection.vue";
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold">داشبورد</h1>
    <p class="mt-2 text-muted-foreground">
      به سامانه {{ appConfig.app.name }} خوش آمدید.
    </p>

    <ServicesSection class="mt-10" />
  </div>
</template>
