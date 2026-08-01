<script setup lang="ts">
import PersonModal from "@/components/PersonModal.vue";
import ServiceCard from "@/components/ServiceCard.vue";

import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import router from "@/router";
import { useStudentApi } from "@/composables/api/useStudentApi";
import { useStudentStore } from "@/stores/student/useStudentStore";
import { services } from "@/constants/services";

type ServiceType = "education" | "internship";

interface UserIdentifier {
  type: "national" | "student";
  value: string;
}

const systemServices = computed(() =>
  services.filter((service) => service.isActive || service.isSupported),
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
    router.push(serviceType === "education" ? "/education" : "/internship");
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
    <div class="w-full mb-10 max-w-max flex-col-center items-start gap-4 text-start">
      <h1 class="text-2xl xs:text-3xl font-bold text-foreground">خدمات قابل دسترس</h1>
      <hr class="w-full h-1 bg-brand-primary-500 border-none rounded-full" />
    </div>

    <div class="flex flex-col gap-4 w-full">
      <div v-for="service in systemServices" :key="service.id" class="w-full">
        <ServiceCard
          :icon="service.icon"
          :title="service.title"
          :description="service.description"
          :is-active="service.isActive"
          :is-supported="service.isSupported"
          @start-service="openServiceModal(service.id as ServiceType)"
        />
      </div>
    </div>

    <PersonModal
      v-model:identifier="identifier"
      v-model:is-open="isModalOpen"
      :is-submitting="isSubmitting"
      @submit="handleServiceRequest"
    />
  </div>
</template>
