<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { useInternshipApi } from "@/composables/api/useInternshipApi";
import type { InternshipStatus } from "@/types/requests/internship";

const props = defineProps<{ trackingNumber: string }>();
const emit = defineEmits<{ issued: [] }>();
const { verifyInternship } = useInternshipApi();
const loading = ref(false);
const status = ref<InternshipStatus>("pending");

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.trackingNumber);
    toast.success("کد پیگیری کپی شد");
  } catch {
    toast.error("کپی کد پیگیری ناموفق بود");
  }
}

async function checkStatus() {
  if (loading.value) return;
  loading.value = true;
  try {
    const result = await verifyInternship(props.trackingNumber);
    status.value = result.status;
    if (result.status === "issued") {
      toast.success("درخواست تایید شده و سند آماده دریافت است");
      emit("issued");
    } else if (result.status === "invalid") {
      toast.error("این درخواست باطل شده است");
    } else {
      toast.info("درخواست همچنان در انتظار تایید مدیر است");
    }
  } catch {
    toast.error("امکان دریافت وضعیت درخواست وجود ندارد");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section class="mx-auto mb-6 w-full max-w-[794px] rounded-2xl border border-amber-200 bg-white p-6 text-start print:hidden" aria-live="polite">
    <div class="flex items-start gap-3">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl text-amber-700" aria-hidden="true">◷</span>
      <div>
        <h2 class="text-lg font-bold text-brand-primary-900">درخواست کارآموزی ثبت شد</h2>
        <p class="mt-1 text-sm leading-7 text-muted-foreground">
          {{ status === 'invalid' ? 'این درخواست باطل شده است.' : 'درخواست شما در انتظار بررسی و تایید مدیر است. سند نهایی و کد QR فقط بعد از تایید صادر می‌شود.' }}
        </p>
      </div>
    </div>
    <div class="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-primary-50 px-4 py-3">
      <div>
        <p class="text-xs text-muted-foreground">کد پیگیری</p>
        <p class="text-lg font-bold text-brand-primary-900" dir="ltr">{{ trackingNumber }}</p>
      </div>
      <Button variant="outline" @click="copyCode">کپی کد</Button>
    </div>
    <div class="mt-5 flex flex-wrap gap-3">
      <Button :disabled="loading" @click="checkStatus">{{ loading ? 'در حال بررسی...' : 'بررسی وضعیت تایید' }}</Button>
      <RouterLink to="/dashboard/services" class="inline-flex items-center rounded-lg border px-4 py-2 text-sm">ثبت درخواست جدید</RouterLink>
    </div>
  </section>
</template>
