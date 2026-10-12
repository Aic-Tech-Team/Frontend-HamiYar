<script setup lang="ts">
import { computed, reactive, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { getInputSize } from "@/utils/formUtils";
import { useEducationFormStore } from "@/stores/education/useEducationFormStore";
import { useGlobalLoadingStore } from "@/stores/useGlobalLoadingStore";
import { useEducationApi } from "@/composables/api/useEducationApi";
import { useStudentStore } from "@/stores/student/useStudentStore";
import { useRequestsFormSubmission } from "@/composables/useRequestsFormSubmission";
import { useDate } from "@/composables/useDate";

import IconSolarUserRoundedBold from "~icons/solar/user-rounded-bold";

const route = useRoute();
const router = useRouter();
const { formatIsoToJalali, formatDateString } = useDate();
const educationFormStore = useEducationFormStore();
const globalLoading = useGlobalLoadingStore();
const studentStore = useStudentStore();
const { getEducationCertificate } = useEducationApi();

const loadFailed = ref(false);
const isPrintView = computed(() => route.meta.print === true);
const qrImageSrc = computed(() => educationFormStore.rawApiResponse?.qr_code_image);
const formData = reactive(educationFormStore.getDefaultFormData());

function prefillFromStudent() {
  const student = studentStore.student;
  if (!student) return;

  formData.header.university = student.university?.name || "";
  formData.header.city = student.university?.city || "";
  formData.student.code = student.student_number || "";
  formData.student.fullName =
    student.full_name || `${student.first_name || ""} ${student.last_name || ""}`.trim();
  formData.student.fatherName = student.father_name || "";
  formData.student.idNumber = student.certificate_number || student.national_id || "";
  formData.student.birthPlace = student.issued_by || "";
  formData.student.birthDate = formatIsoToJalali(student.birth_date);
  formData.education.field = student.field_of_study || "";
  formData.education.degreeType = student.education_level || "";
  formData.education.method = student.education_system || "";
  formData.education.entrySemester = student.entry_term || "";
  formData.education.entryAcademicYear = student.entry_year || "";
}

async function loadPublicData() {
  const trackingNumber = (route.params.trackingNumber as string) || "";
  if (!trackingNumber) {
    router.replace({ name: "Error", params: { code: "404" } });
    return;
  }

  try {
    const apiResponse = await getEducationCertificate(trackingNumber);

    educationFormStore.setFormDataFromApi(apiResponse);

    if (educationFormStore.formData) {
      Object.assign(formData, educationFormStore.formData);
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
  () => educationFormStore.formData,
  (storeData) => {
    if (storeData) Object.assign(formData, storeData);
  },
  { immediate: false },
);

function requiredValues() {
  return [
    formData.student.code,
    formData.education.currentSemester,
    formData.education.currentAcademicYear,
    formData.certificate.recipient,
  ];
}

const isFilled = (value: unknown) => String(value || "").trim().length > 0;

function validateForm() {
  return requiredValues().every(isFilled);
}

const missingCount = computed(() => requiredValues().filter((v) => !isFilled(v)).length);

const mobileSummary = computed<MobileSummaryRow[]>(() => [
  { label: "نام و نام خانوادگی", value: formData.student.fullName },
  { label: "شماره دانشجویی", value: formData.student.code },
  { label: "رشته", value: formData.education.field },
  { label: "مقطع", value: formData.education.degreeType },
  { label: "ورودی", value: formData.education.entryAcademicYear },
]);

const {
  isEditMode,
  isSubmitted,
  isSubmitting,
  handleSubmit: submitForm,
} = useRequestsFormSubmission(validateForm, "education");

const { isMobileEntry, isDesktopEntry, showStatic } = useMobileEntryMode(isSubmitted, isPrintView);

function handleSubmit() {
  submitForm(formData);
}

function handleIssuance() {
  const tn = educationFormStore.trackingNumber;
  if (!tn) return;
  const routeData = router.resolve({
    name: "EducationPublic",
    params: { trackingNumber: tn },
  });
  // Same tab, replacing this entry: going back must not land on an empty form that could be re-submitted.
  router.replace(routeData);
}

const documentLink = computed(() => {
  const tn = educationFormStore.trackingNumber;
  if (!tn) return "";
  const href = router.resolve({ name: "EducationPublic", params: { trackingNumber: tn } }).href;
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
    title="گواهی اشتغال به تحصیل"
    description="اطلاعات دانشجو از پرونده او خوانده شده است. فقط موارد زیر را کامل کنید."
    :summary="mobileSummary"
    :missing-count="missingCount"
    :is-submitting="isSubmitting"
    @submit="handleSubmit"
  >
    <MobileField label="نیمسال جاری" for="m-semester" required>
      <Input
        id="m-semester"
        v-model="formData.education.currentSemester"
        class="h-12 text-base"
        placeholder="مثلاً دوم"
        autocomplete="off"
      />
    </MobileField>
    <MobileField label="سال تحصیلی جاری" for="m-year" required>
      <Input
        id="m-year"
        v-model="formData.education.currentAcademicYear"
        class="h-12 text-base"
        placeholder="1404-1405"
        inputmode="numeric"
        dir="ltr"
        autocomplete="off"
      />
    </MobileField>
    <MobileField
      label="سازمان یا مرجع دریافت‌کننده"
      for="m-recipient"
      required
      hint="گواهی برای ارائه به این مرجع صادر می‌شود."
    >
      <Input
        id="m-recipient"
        v-model="formData.certificate.recipient"
        class="h-12 text-base"
        placeholder="نام سازمان"
        autocomplete="off"
      />
    </MobileField>
    <MobileField label="توضیحات" for="m-description">
      <Textarea
        id="m-description"
        v-model="formData.description"
        class="min-h-28 resize-none text-base"
        placeholder="توضیحات را اینجا وارد کنید..."
      />
    </MobileField>
  </MobileEntryForm>

  <FormSubmissionBanner
    v-if="isSubmitted && !isPrintView && educationFormStore.trackingNumber"
    :tracking-number="educationFormStore.trackingNumber"
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
    <p class="font-bold text-sm mb-4">گواهی می شود :</p>
    <section class="leading-10">
      آقای / خانم <span class="display-value">{{ formData.student.fullName }}</span> فرزند
      <span class="display-value">{{ formData.student.fatherName }}</span> شماره شناسنامه
      <span class="display-value">{{ formData.student.idNumber }}</span> صادره از
      <span class="display-value">{{ formData.student.birthPlace }}</span> متولد
      <span class="display-value">{{ formData.student.birthDate }}</span> دانشجوی رشته
      <span class="display-value">{{ formData.education.field }}</span> ورودی نیمسال
      <span class="display-value">{{ formData.education.entrySemester }}</span> سال تحصیلی
      <span class="display-value">{{ formData.education.entryAcademicYear }}</span> مقطع
      <span class="display-value">{{ formData.education.degreeType }}</span> شیوه آموزش
      <span class="display-value">{{ formData.education.method }}</span>
      در این واحد دانشگاهی می باشد.
    </section>

    <section :class="!isSubmitted ? 'leading-12' : 'leading-10'">
      نامبرده در نیمسال
      <Input
        v-if="!showStatic"
        v-model="formData.education.currentSemester"
        required
        :highlight="isEditMode"
        class="input"
        placeholder="دوم"
        :size="getInputSize(formData.education.currentSemester, 3)"
        :disabled="isInputDisabled"
        :readonly="isInputDisabled"
      />
      <span v-if="showStatic" class="display-value">{{ formData.education.currentSemester }}</span>
      سال تحصیلی
      <Input
        v-if="!showStatic"
        v-model="formData.education.currentAcademicYear"
        required
        :highlight="isEditMode"
        class="input"
        placeholder="1404-1405"
        :size="getInputSize(formData.education.currentAcademicYear, 8)"
        :disabled="isInputDisabled"
        :readonly="isInputDisabled"
      />
      <span v-if="showStatic" class="display-value">{{
        formData.education.currentAcademicYear
      }}</span>
      ثبت نام نموده و اشتغال به تحصیل دارد .
    </section>

    <section :class="!isSubmitted ? 'leading-12' : 'leading-10'">
      این گواهی جهت ارائه به
      <Input
        v-if="!showStatic"
        v-model="formData.certificate.recipient"
        required
        :highlight="isEditMode"
        class="input"
        placeholder="نام سازمان"
        :size="getInputSize(formData.certificate.recipient)"
        :disabled="isInputDisabled"
        :readonly="isInputDisabled"
      />
      <span v-if="showStatic" class="display-value">{{ formData.certificate.recipient }}</span>
      صادر شده و ارزش دیگری ندارد.
    </section>

    <section v-if="isPrintView" class="leading-10">
      اعتبار این گواهی تا تاریخ
      <span class="display-value">{{
        formatDateString(formData.certificate.validityDate) || formData.certificate.validityDate
      }}</span>
      می باشد .
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
