<script setup lang="ts">
import PersonModal from "@/components/PersonModal.vue";
import ServiceCard from "@/components/dashboard/ServiceCard.vue";
 
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
 
// for separating which services should be shown in authenticated home page
const systemServices = computed(() => services.filter((service) => service.isSupported));
 
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
    // Call check-student API with selected identifier type
    const response = await checkStudent(identifier.value, identifier.type);
 
    if (!response.exists || !response.student_info) {
      throw new Error("دانشجویی با این مشخصات یافت نشد");
    }
 
    // Store student info in a single store
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
 
    // Use the pre-extracted message from our interceptor
    const errorMessage = error?.response?.status === 404
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
  <section
    id="services"
    class="flex flex-col justify-center items-center container-padding text-center scroll-mt-20 sm:scroll-mt-24"
  >
    <section class="w-full max-w-max mb-16 flex-col-center gap-4">
      <h2 class="text-2xl xs:text-3xl font-bold text-foreground">خدمات قابل دسترس</h2>
      <hr class="w-3/5 max-w-xs h-1 bg-brand-primary-500 border-none rounded-full" />
    </section>
 
    <div class="gap-y-16 gap-x-6 flex flex-col md:flex-row w-full max-w-6xl">
      <div v-for="service in systemServices" :key="service.id" class="flex-1 w-full md:w-1/2">
        <ServiceCard
          :icon="service.icon"
          :title="service.title"
          :description="service.description"
          :is-active="service.isActive"
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
  </section>
</template>