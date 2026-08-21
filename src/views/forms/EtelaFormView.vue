<script setup lang="ts">
import { computed, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/DatePicker.vue";
import FormDocumentActions from "@/components/forms/FormDocumentActions.vue";
import FormDocumentSignature from "@/components/forms/FormDocumentSignature.vue";
import FormDocumentPrintMarks from "@/components/forms/FormDocumentPrintMarks.vue";
import { useEtelaFormStore } from "@/stores/etela/useEtelaFromStore";
import { useGlobalLoadingStore } from "@/stores/useGlobalLoadingStore";
import { useEtelaApi } from "@/composables/api/useEtelaApi";
import { useStudentStore } from "@/stores/student/useStudentStore";
import { useRequestsFormSubmission } from "@/composables/useRequestsFormSubmission";
import { useDate } from "@/composables/useDate";

import IconSolarUserRoundedBold from "~icons/solar/user-rounded-bold";

const route = useRoute();
const router = useRouter();
const { formatDateString } = useDate();
const elaFormStore = useEtelaFormStore();
const globalLoading = useGlobalLoadingStore();
const studentStore = useStudentStore();
const { getEtelaCertificate } = useEtelaApi();

const isPrintView = computed(() => route.meta.print === true);
const qrImageSrc = computed(() => elaFormStore.rawApiResponse?.qr_code_image);
const formData = reactive(elaFormStore.getDefaultFormData());

function prefillFromStudent() {
  const student = studentStore.student;
  if (!student) return;

  formData.header.university = student.university?.name || "";
  formData.header.city = student.university?.city || "";
  formData.student.code = student.student_number || "";
  formData.student.fullName =
    student.full_name || `${student.first_name || ""} ${student.last_name || ""}`.trim();
  formData.student.idNumber = student.national_id || student.certificate_number || "";
  formData.certificate = student.certificate_number || "";
}

async function loadPublicData() {
  const trackingNumber = (route.params.trackingNumber as string) || "";
  if (!trackingNumber) {
    router.replace({ name: "Error", params: { code: "404" } });
    return;
  }

  try {
    const apiResponse = await getEtelaCertificate(trackingNumber);

    elaFormStore.setFormDataFromApi(apiResponse);

    if (elaFormStore.formData) {
      Object.assign(formData, elaFormStore.formData);
    }
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status ?? 404;
    router.replace({ name: "Error", params: { code: String(status) } });
  }
}

onMounted(async () => {
  if (isPrintView.value) {
    globalLoading.show();
    try {
      await loadPublicData();
      isSubmitted.value = true;
      isEditMode.value = false;
    } finally {
      globalLoading.hide();
    }
    return;
  }

  if (!studentStore.exists) {
    router.replace("/");
    return;
  }

  prefillFromStudent();
});

watch(
  () => elaFormStore.formData,
  (storeData) => {
    if (storeData) Object.assign(formData, storeData);
  },
  { immediate: false },
);

function validateForm() {
  const required = [formData.student.code, formData.courseDate, formData.gender];
  return required.every((f) => String(f || "").trim().length > 0);
}

const honorific = computed(() => {
  if (formData.gender === "female") return "سرکار خانم";
  if (formData.gender === "male") return "جناب آقای";
  return "";
});

const {
  isEditMode,
  isSubmitted,
  isSubmitting,
  isFormValid,
  handleSubmit: submitForm,
  resetForm,
} = useRequestsFormSubmission(validateForm, "etela");

function handleSubmit() {
  submitForm(formData);
}

function handleIssuance() {
  const tn = elaFormStore.trackingNumber;
  if (!tn) return;
  const routeData = router.resolve({
    name: "EtelaPublic",  // was "ElaPublic"
    params: { trackingNumber: tn },
  });
  window.open(routeData.href, "_blank");
}

const isInputDisabled = computed(() => isSubmitted.value || !isEditMode.value);
</script>

<template>
  <div
    class="flex flex-col grow w-full h-full min-h-0"
    :data-submitted="isSubmitted ? '' : undefined"
  >
  <header class="flex justify-between items-start mb-6">
    <div class="text-right w-1/3 font-bold text-sm space-y-1">
      <h1>{{ formData.header.university }}</h1>
      <h2>{{ formData.header.city }}</h2>
    </div>
    <div class="w-1/3 flex flex-col items-center justify-center">
      <img src="@/assets/images/azad-logo.png" alt="Logo" width="60" class="grayscale" />
    </div>
    <div class="text-left w-1/3 text-xs space-y-1 *:flex *:justify-end *:gap-2 *:items-center">
      <div>
        <strong>تاریخ:</strong><span>{{ formData.header.date }}</span>
      </div>
      <div>
        <strong>شماره:</strong><span dir="ltr">{{ formData.header.number }}</span>
      </div>
      <div>
        <strong>پیوست:</strong><span>{{ formData.header.attachment }}</span>
      </div>
    </div>
  </header>

  <section class="relative w-full flex justify-between items-start">
    <div class="flex items-center gap-2 justify-start w-1/3 text-sm">
      <strong>شماره دانشجویی :</strong><span>{{ formData.student.code }}</span>
    </div>
    <div class="text-center w-1/3">
      <span class="font-bold">باسمه تعالی</span>
    </div>
    <div class="w-1/3 flex justify-end">
      <figure
        class="border w-[30mm] h-[40mm] border-neutral-400 p-1 bg-white grayscale flex-center"
      >
        <div class="w-full h-full bg-transparent border border-neutral-300 flex-center">
          <IconSolarUserRoundedBold class="text-neutral-600" width="60" height="60" />
        </div>
      </figure>
    </div>
  </section>

  <section class="text-xs font-medium px-2">
    <p class="font-bold text-sm mb-4">گواهی طرح اعتلا</p>

    <section :class="!isSubmitted ? 'leading-12' : 'leading-10'">
      بدین وسیله گواهی می‌شود
      <RadioGroup
        v-if="!isPrintView"
        v-model="formData.gender"
        :disabled="isInputDisabled"
        class="inline-flex items-center gap-3 mx-1 align-middle"
        :class="{ 'rounded-md border border-brand-primary-500 px-2 py-1': isEditMode && !formData.gender }"
      >
        <div class="flex items-center gap-1.5">
          <RadioGroupItem id="etela-gender-female" value="female" />
          <Label for="etela-gender-female" class="cursor-pointer">سرکار خانم</Label>
        </div>
        <div class="flex items-center gap-1.5">
          <RadioGroupItem id="etela-gender-male" value="male" />
          <Label for="etela-gender-male" class="cursor-pointer">جناب آقای</Label>
        </div>
      </RadioGroup>
      <span v-else class="display-value">{{ honorific }}</span>
      <span class="display-value">{{ formData.student.fullName }}</span>
      با کد ملی
      <span class="display-value" dir="ltr">{{ formData.student.idNumber }}</span>
      موفق به گذراندن ۸ ساعت دوره «طرح ملی اعتلا» از دوره‌های توان‌افزایی ویژه دستیاران آموزشی در
      تاریخ

      <DatePicker
        v-if="!isPrintView"
        v-model:date="formData.courseDate"
        :highlight="isEditMode"
        :disabled="isInputDisabled"
      />
      <span v-if="isPrintView" class="display-value">{{
        formatDateString(formData.courseDate) || formData.courseDate
      }}</span>

      ذیل آیین‌نامه دستیاری آموزشی به شماره ۱۰/۱۵۹۸ مورخ ۱۴۰۲/۰۵/۲۲ شده‌اند.
    </section>
  </section>

  <section class="mt-4">
    <p class="font-bold text-sm">توضیحات {{ !isPrintView ? "(اختیاری)" : "" }} :</p>
    <div v-if="!isPrintView" class="mt-2">
      <Textarea
        v-model="formData.description"
        :disabled="isInputDisabled"
        :readonly="isInputDisabled"
        class="min-h-28 resize-none"
        placeholder="توضیحات را اینجا وارد کنید..."
      />
    </div>
    <div v-if="isPrintView" class="mt-2 min-h-20">
      <p class="text-xs leading-7">{{ formData.description }}</p>
    </div>
  </section>

  <FormDocumentSignature
    v-if="isPrintView && formData.signature"
    :signature="formData.signature"
  />

  <FormDocumentActions
    :is-submitted="isSubmitted"
    :is-submitting="isSubmitting"
    :is-form-valid="isFormValid"
    :is-print-view="isPrintView"
    :show-edit-button="!isPrintView"
    @submit="handleSubmit"
    @edit="resetForm"
    @issuance="handleIssuance"
  />

  <FormDocumentPrintMarks
    v-if="isPrintView"
    :qr-image-src="qrImageSrc"
    :university-name="formData.header.university"
  />
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";
.input {
  @apply w-auto min-w-0 mx-1 font-bold placeholder:font-medium;
}
.display-value {
  @apply font-bold text-sm mx-1;
}
</style>