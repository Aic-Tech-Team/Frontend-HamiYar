<script setup lang="ts">
import PersonModal from "@/components/PersonModal.vue";
import ServiceCard from "@/components/dashboard/ServiceCard.vue";
import PageHeader from "@/components/dashboard/PageHeader.vue";

import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import router from "@/router";
import { useStudentApi } from "@/composables/api/useStudentApi";
import { useStudentStore } from "@/stores/student/useStudentStore";
import { services } from "@/constants/services";

type ServiceType = "education" | "internship" | "etela";

interface UserIdentifier {
  type: "national" | "student";
  value: string;
}

// One explicit place mapping each service to its destination — a ternary
// can't safely express three outcomes, a map always can, no matter how
// many more get added later.
const SERVICE_ROUTES: Record<ServiceType, string> = {
  education: "/education",
  internship: "/internship",
  etela: "/etela",
};

const systemServices = computed(() =>
  services.filter((service) => service.isActive || service.isSupported),
);

const activeServices = computed(() =>
  systemServices.value.filter((service) => service.isActive && service.isSupported),
);
const upcomingServices = computed(() =>
  systemServices.value.filter((service) => service.isSupported && !service.isActive),
);

const currentServiceType = ref<ServiceType | null>(null);
const isModalOpen = ref(false);
const identifier = ref("");
const isSubmitting = ref(false);

const { checkStudent } = useStudentApi();
const studentStore = useStudentStore();

function openServiceModal(type: ServiceType) {
  currentServiceType.value = type;
  isModalOpen.value = true;
}

async function handleServiceRequest(identifier: UserIdentifier): Promise<void> {
  if (!currentServiceType.value || isSubmitting.value) return;

  const serviceType = currentServiceType.value;
  isSubmitting.value = true;

  try {
    const response = await checkStudent(identifier.value, identifier.type);

    if (!response.exists || !response.student_info) {
      throw new Error("دانشجویی با این مشخصات یافت نشد");
    }

    studentStore.setStudent(response.student_info);

    toast.success("موفقیت آمیز!", {
      description: "اطلاعات مورد نظر یافت شد، درحال انتقال...",
      richColors: true,
    });

    identifier.value = "";
    isModalOpen.value = false;
    currentServiceType.value = null;
    router.push(SERVICE_ROUTES[serviceType]);
  } catch (error: any) {
    console.error("Error checking student:", error);

    const errorMessage =
      error?.response?.status === 404
        ? "کاربری با این مشخصات یافت نشد"
        : error.extractedMessage || "خطا در ارتباط با سرور";

    toast.error("خطا!", {
      description: errorMessage,
      richColors: true,
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div>
    <PageHeader
      title="خدمات سامانه"
      description="خدمت مورد نظر را انتخاب کنید و با شماره دانشجویی یا کد ملی، درخواست را برای دانشجو ثبت کنید."
    />

    <section aria-labelledby="active-services">
      <h2 id="active-services" class="mb-4 text-sm font-semibold text-brand-primary-700">
        آماده ثبت درخواست
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ServiceCard
          v-for="service in activeServices"
          :key="service.id"
          :icon="service.icon"
          :title="service.title"
          :description="service.description"
          :is-active="service.isActive"
          :is-supported="service.isSupported"
          @start-service="openServiceModal(service.id as ServiceType)"
        />
      </div>
    </section>

    <section v-if="upcomingServices.length" class="mt-10" aria-labelledby="upcoming-services">
      <h2 id="upcoming-services" class="mb-4 text-sm font-semibold text-brand-primary-700">
        در دست راه‌اندازی
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ServiceCard
          v-for="service in upcomingServices"
          :key="service.id"
          :icon="service.icon"
          :title="service.title"
          :description="service.description"
          :is-active="service.isActive"
          :is-supported="service.isSupported"
        />
      </div>
    </section>

    <PersonModal
      v-model:identifier="identifier"
      v-model:is-open="isModalOpen"
      :is-submitting="isSubmitting"
      @submit="handleServiceRequest"
    />
  </div>
</template>