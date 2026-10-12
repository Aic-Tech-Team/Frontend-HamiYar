<script setup lang="ts">
import { computed, reactive, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/DatePicker.vue";
import FormDocumentActions from "@/components/forms/FormDocumentActions.vue";
import FormDocumentSignature from "@/components/forms/FormDocumentSignature.vue";
import FormDocumentPrintMarks from "@/components/forms/FormDocumentPrintMarks.vue";
import MobileEntryForm from "@/components/forms/MobileEntryForm.vue";
import type { MobileSummaryRow } from "@/components/forms/MobileEntryForm.vue";
import FormSubmissionBanner from "@/components/forms/FormSubmissionBanner.vue";
import FormDocumentNotFound from "@/components/forms/FormDocumentNotFound.vue";
import FormPaperFrame from "@/components/forms/FormPaperFrame.vue";
import MobileField from "@/components/forms/MobileField.vue";
import { useMobileEntryMode } from "@/composables/useMobileEntryMode";
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

const loadFailed = ref(false);
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
    if (status === 404) {
      loadFailed.value = true;
      return;
    }
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

function requiredValues() {
  return [formData.student.code, formData.courseDate, formData.gender];
}

const isFilled = (value: unknown) => String(value || "").trim().length > 0;

function validateForm() {
  return requiredValues().every(isFilled);
}

const missingCount = computed(() => requiredValues().filter((v) => !isFilled(v)).length);

const mobileSummary = computed<MobileSummaryRow[]>(() => [
  { label: "نام و نام خانوادگی", value: formData.student.fullName },
  { label: "شماره دانشجویی", value: formData.student.code },
  { label: "کد ملی", value: formData.student.idNumber },
]);

const honorific = computed(() => {
  if (formData.gender === "female") return "سرکار خانم";
  if (formData.gender === "male") return "جناب آقای";
  return "";
});

const {
  isEditMode,
  isSubmitted,
  isSubmitting,
  handleSubmit: submitForm,
} = useRequestsFormSubmission(validateForm, "etela");

const { isMobileEntry, isDesktopEntry, showStatic } = useMobileEntryMode(isSubmitted, isPrintView);

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
  // Same tab, replacing this entry: going back must not land on an empty form that could be re-submitted.
  router.replace(routeData);
}

const documentLink = computed(() => {
  const tn = elaFormStore.trackingNumber;
  if (!tn) return "";
  const href = router.resolve({ name: "EtelaPublic", params: { trackingNumber: tn } }).href;
  return new URL(href, window.location.origin).href;
});

const isInputDisabled = computed(() => isSubmitted.value || !isEditMode.value);
</script>

<template>
  <div
    :class="isDesktopEntry ? 'grid grid-cols-[minmax(0,26rem)_minmax(0,1fr)] items-start gap-8' : 'flex flex-col grow w-full'"
    :data-submitted="isSubmitted ? '' : undefined"
  >
  <MobileEntryForm
    v-if="isMobileEntry || isDesktopEntry"
    :variant="isDesktopEntry ? 'desktop' : 'phone'"
    title="گواهی طرح اعتلا"
    description="اطلاعات دانشجو از پرونده او خوانده شده است. جنسیت و تاریخ دوره را مشخص کنید."
    :summary="mobileSummary"
    :missing-count="missingCount"
    :is-submitting="isSubmitting"
    @submit="handleSubmit"
  >
    <MobileField label="عنوان در گواهی">
      <RadioGroup v-model="formData.gender" class="grid grid-cols-2 gap-3">
        <Label
          for="m-etela-female"
          class="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-input px-4 has-[[data-state=checked]]:border-brand-primary-500 has-[[data-state=checked]]:bg-brand-primary-50"
        >
          <RadioGroupItem id="m-etela-female" value="female" />
          سرکار خانم
        </Label>
        <Label
          for="m-etela-male"
          class="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-input px-4 has-[[data-state=checked]]:border-brand-primary-500 has-[[data-state=checked]]:bg-brand-primary-50"
        >
          <RadioGroupItem id="m-etela-male" value="male" />
          جناب آقای
        </Label>
      </RadioGroup>
    </MobileField>
    <MobileField label="تاریخ برگزاری دوره" required>
      <DatePicker
        v-model:date="formData.courseDate"
        trigger-class="mx-0 h-12 w-full text-base"
      />
    </MobileField>
    <MobileField label="توضیحات" for="m-etela-description">
      <Textarea
        id="m-etela-description"
        v-model="formData.description"
        class="min-h-28 resize-none text-base"
        placeholder="توضیحات را اینجا وارد کنید..."
      />
    </MobileField>
  </MobileEntryForm>

  <FormSubmissionBanner
    v-if="isSubmitted && !isPrintView && elaFormStore.trackingNumber"
    :tracking-number="elaFormStore.trackingNumber"
    :document-link="documentLink"
    @issue="handleIssuance"
  />

  <FormDocumentNotFound v-if="loadFailed" />

  <FormPaperFrame v-if="!isMobileEntry && !loadFailed" :preview="isDesktopEntry" :submitted="isSubmitted">
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
        v-if="!showStatic"
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
        v-if="!showStatic"
        v-model:date="formData.courseDate"
        :highlight="isEditMode"
        :disabled="isInputDisabled"
      />
      <span v-if="showStatic" class="display-value">{{
        formatDateString(formData.courseDate) || formData.courseDate
      }}</span>

      ذیل آیین‌نامه دستیاری آموزشی به شماره ۱۰/۱۵۹۸ مورخ ۱۴۰۲/۰۵/۲۲ شده‌اند.
    </section>
  </section>

  <section class="mt-4">
    <p class="font-bold text-sm">توضیحات {{ !showStatic ? "(اختیاری)" : "" }} :</p>
    <div v-if="!showStatic" class="mt-2">
      <Textarea
        v-model="formData.description"
        :disabled="isInputDisabled"
        :readonly="isInputDisabled"
        class="min-h-28 resize-none"
        placeholder="توضیحات را اینجا وارد کنید..."
      />
    </div>
    <div v-if="showStatic" class="mt-2 min-h-20">
      <p class="text-xs leading-7">{{ formData.description }}</p>
    </div>
  </section>

  <FormDocumentSignature
    v-if="isPrintView && formData.signature"
    :signature="formData.signature"
  />

  <FormDocumentActions v-if="isPrintView" />

  <FormDocumentPrintMarks
    v-if="isPrintView"
    :qr-image-src="qrImageSrc"
    :university-name="formData.header.university"
  />
  </FormPaperFrame>
  </div>
</template>

<style scoped>
@reference "@/assets/css/main.css";
.input {
  @apply w-auto min-w-0 mx-1 font-bold placeholder:font-medium;
}
.display-value:empty {
  @apply inline-block min-w-16 border-b border-dotted border-neutral-400;
}
.display-value {
  @apply font-bold text-sm mx-1;
}
</style>