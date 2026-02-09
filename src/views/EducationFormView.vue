<script setup lang="ts">
import { computed, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FormViewLayout from "@/components/FormViewLayout.vue";
import { getInputSize } from "@/utils/formUtils";
import { Icon } from "@iconify/vue";
import { useEducationFormStore } from "@/stores/education/useEducationFormStore";
import { useGlobalLoadingStore } from "@/stores/useGlobalLoadingStore";
import { useEducationApi } from "@/composables/api/useEducationApi";
import { useStudentStore } from "@/stores/student/useStudentStore";
import { useRequestsFormSubmission } from "@/composables/useRequestsFormSubmission";
import { useDate } from "@/composables/useDate";

const route = useRoute();
const router = useRouter();
const { formatIsoToJalali, formatDateString } = useDate();
const educationFormStore = useEducationFormStore();
const globalLoading = useGlobalLoadingStore();
const studentStore = useStudentStore();
const { getEducationCertificate } = useEducationApi();

const isPrintView = computed(() => route.meta.mode === "public");
const qrImageSrc = computed(() => educationFormStore.rawApiResponse?.qr_code_image);
const formData = reactive(educationFormStore.getDefaultFormData());

// Prefill from student store
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

// Load public data
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
    router.replace({ name: "Error", params: { code: String(status) } });
  }
}

// Initialize
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

// Sync with store
watch(
  () => educationFormStore.formData,
  (storeData) => {
    if (storeData) Object.assign(formData, storeData);
  },
  { immediate: false },
);

// Validation - only fields we send in POST
function validateForm() {
  const required = [
    formData.student.code,
    formData.education.currentSemester,
    formData.education.currentAcademicYear,
    formData.certificate.recipient,
  ];
  return required.every((f) => String(f || "").trim().length > 0);
}

// Form submission
const {
  isEditMode,
  isSubmitted,
  isSubmitting,
  isFormValid,
  handleSubmit: submitForm,
  resetForm,
} = useRequestsFormSubmission(validateForm, "education");

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
  window.open(routeData.href, "_blank");
}

const isInputDisabled = computed(() => isSubmitted.value || !isEditMode.value);
</script>

<template>
  <FormViewLayout
    v-model:is-edit-mode="isEditMode"
    :is-submitted="isSubmitted"
    :is-submitting="isSubmitting"
    :is-form-valid="isFormValid"
    :is-print-view="isPrintView"
    :show-edit-button="!isPrintView"
    :qr-image-src="qrImageSrc"
    :signature="formData.signature"
    :university-name="formData.header.university"
    @submit="handleSubmit"
    @edit="resetForm"
    @issuance="handleIssuance"
  >
    <template #header>
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
              <Icon
                icon="material-symbols:person-rounded"
                class="text-neutral-600"
                width="60"
                height="60"
              />
            </div>
          </figure>
        </div>
      </section>
    </template>

    <template #body>
      <section class="text-xs font-medium px-2">
        <p class="font-bold text-sm mb-4">گواهی می شود :</p>
        <section class="leading-8">
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

        <section :class="!isSubmitted ? 'leading-12' : 'leading-8'">
          نامبرده در نیمسال
          <Input
            v-if="!isPrintView"
            v-model="formData.education.currentSemester"
            required
            :highlight="isEditMode"
            class="input"
            placeholder="دوم"
            :size="getInputSize(formData.education.currentSemester, 3)"
            :disabled="isInputDisabled"
            :readonly="isInputDisabled"
          />
          <span v-if="isPrintView" class="display-value">{{
            formData.education.currentSemester
          }}</span>
          سال تحصیلی
          <Input
            v-if="!isPrintView"
            v-model="formData.education.currentAcademicYear"
            required
            :highlight="isEditMode"
            class="input"
            placeholder="1404-1405"
            :size="getInputSize(formData.education.currentAcademicYear, 8)"
            :disabled="isInputDisabled"
            :readonly="isInputDisabled"
          />
          <span v-if="isPrintView" class="display-value">{{
            formData.education.currentAcademicYear
          }}</span>
          ثبت نام نموده و اشتغال به تحصیل دارد .
        </section>

        <section :class="!isSubmitted ? 'leading-12' : 'leading-8'">
          این گواهی جهت ارائه به
          <Input
            v-if="!isPrintView"
            v-model="formData.certificate.recipient"
            required
            :highlight="isEditMode"
            class="input"
            placeholder="نام سازمان"
            :size="getInputSize(formData.certificate.recipient)"
            :disabled="isInputDisabled"
            :readonly="isInputDisabled"
          />
          <span v-if="isPrintView" class="display-value">{{ formData.certificate.recipient }}</span>
          صادر شده و ارزش دیگری ندارد.
        </section>

        <section v-if="isPrintView" class="leading-8">
          اعتبار این گواهی تا تاریخ
          <span class="display-value">{{
            formatDateString(formData.certificate.validityDate) || formData.certificate.validityDate
          }}</span>
          می باشد .
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
    </template>
  </FormViewLayout>
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
