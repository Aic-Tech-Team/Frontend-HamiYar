<script setup lang="ts">
import { computed, reactive, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import { useInternshipFormStore } from "@/stores/internship/useInternshipFormStore";
import { useGlobalLoadingStore } from "@/stores/useGlobalLoadingStore";
import { useInternshipApi } from "@/composables/api/useInternshipApi";
import { useStudentStore } from "@/stores/student/useStudentStore";
import { useRequestsFormSubmission } from "@/composables/useRequestsFormSubmission";

const route = useRoute();
const router = useRouter();
const internshipFormStore = useInternshipFormStore();
const globalLoading = useGlobalLoadingStore();
const studentStore = useStudentStore();
const { getInternshipLetter } = useInternshipApi();

const loadFailed = ref(false);
const isPrintView = computed(() => route.meta.print === true);
const qrImageSrc = computed(() => internshipFormStore.rawApiResponse?.qr_code_image);
const formData = reactive(internshipFormStore.getDefaultFormData());

/** City line only when not already inside university name (avoids «واحد کرج (واحد کرج)»). */
const headerCityLine = computed(() => {
  const university = formData.header.university?.trim() || "";
  const city = formData.header.city?.trim() || "";
  if (!city) return "";
  return university.includes(city) ? "" : city;
});

function prefillFromStudent() {
  const student = studentStore.student;
  if (!student) return;

  formData.header.university = student.university?.name || "";
  formData.header.city = student.university?.city || "";
  formData.student.code = student.student_number || "";
  formData.student.fullName =
    student.full_name || `${student.first_name || ""} ${student.last_name || ""}`.trim();
  formData.education.field = student.field_of_study || "";
  formData.education.entryAcademicYear = student.entry_year || "";
  formData.education.degreeType = student.education_level || "";
  formData.education.system = student.education_system || "";
}

async function loadPublicData() {
  const trackingNumber = (route.params.trackingNumber as string) || "";
  if (!trackingNumber) {
    router.replace({ name: "Error", params: { code: "404" } });
    return;
  }

  try {
    const apiResponse = await getInternshipLetter(trackingNumber);

    internshipFormStore.setFormDataFromApi(apiResponse);

    if (internshipFormStore.formData) {
      Object.assign(formData, internshipFormStore.formData);
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
  () => internshipFormStore.formData,
  (storeData) => {
    if (storeData) Object.assign(formData, storeData);
  },
  { immediate: false },
);

function requiredValues() {
  return [
    formData.student.code,
    formData.internship.companyName,
    formData.internship.address,
    formData.internship.postalCode,
    formData.internship.course,
    formData.internship.duration,
    formData.internship.instructor,
    formData.internship.department,
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
} = useRequestsFormSubmission(validateForm, "internship");

const { isMobileEntry, isDesktopEntry, showStatic } = useMobileEntryMode(isSubmitted, isPrintView);

function handleSubmit() {
  submitForm(formData);
}

function handleIssuance() {
  const tn = internshipFormStore.trackingNumber;
  if (!tn) return;
  const routeData = router.resolve({
    name: "InternshipPublic",
    params: { trackingNumber: tn },
  });
  // Same tab, replacing this entry: going back must not land on an empty form that could be re-submitted.
  router.replace(routeData);
}

const documentLink = computed(() => {
  const tn = internshipFormStore.trackingNumber;
  if (!tn) return "";
  const href = router.resolve({ name: "InternshipPublic", params: { trackingNumber: tn } }).href;
  return new URL(href, window.location.origin).href;
});

const isInputDisabled = computed(() => isSubmitted.value || !isEditMode.value);
const disciplinaryCaseValue = computed({
  get: () => (formData.internship.disciplinarian ? "yes" : "no"),
  set: (value: string) => {
    formData.internship.disciplinarian = value === "yes";
  },
});
</script>

<template>
  <div
    :class="isDesktopEntry ? 'grid grid-cols-[minmax(0,26rem)_minmax(0,1fr)] items-start gap-8' : 'flex flex-col grow w-full'"
    :data-submitted="isSubmitted ? '' : undefined"
  >
  <MobileEntryForm
    v-if="isMobileEntry || isDesktopEntry"
    :variant="isDesktopEntry ? 'desktop' : 'phone'"
    title="نامه معرفی کارآموزی"
    description="اطلاعات دانشجو از پرونده او خوانده شده است. مشخصات محل کارآموزی را وارد کنید."
    :summary="mobileSummary"
    :missing-count="missingCount"
    :is-submitting="isSubmitting"
    @submit="handleSubmit"
  >
    <MobileField label="نام شرکت یا سازمان" for="m-company" required>
      <Input
        id="m-company"
        v-model="formData.internship.companyName"
        class="h-12 text-base"
        placeholder="نام شرکت"
        autocomplete="off"
      />
    </MobileField>
    <MobileField label="دپارتمان / واحد" for="m-department" required>
      <Input
        id="m-department"
        v-model="formData.internship.department"
        class="h-12 text-base"
        placeholder="دپارتمان / واحد"
        autocomplete="off"
      />
    </MobileField>
    <MobileField label="آدرس محل کارآموزی" for="m-address" required>
      <Textarea
        id="m-address"
        v-model="formData.internship.address"
        class="min-h-24 resize-none text-base"
        placeholder="آدرس را اینجا وارد کنید..."
      />
    </MobileField>
    <MobileField label="کدپستی" for="m-postal" required>
      <Input
        id="m-postal"
        v-model="formData.internship.postalCode"
        class="h-12 text-base"
        placeholder="کد پستی ۱۰ رقمی"
        inputmode="numeric"
        dir="ltr"
        autocomplete="postal-code"
      />
    </MobileField>
    <MobileField label="عنوان دوره کارآموزی" for="m-course" required>
      <Input
        id="m-course"
        v-model="formData.internship.course"
        class="h-12 text-base"
        placeholder="دوره کارآموزی"
        autocomplete="off"
      />
    </MobileField>
    <MobileField label="مدت کارآموزی (ساعت)" for="m-duration" required>
      <Input
        id="m-duration"
        v-model="formData.internship.duration"
        class="h-12 text-base"
        placeholder="مثلاً ۲۴۰"
        inputmode="numeric"
        dir="ltr"
        autocomplete="off"
      />
    </MobileField>
    <MobileField label="استاد درس کارآموزی" for="m-instructor" required>
      <Input
        id="m-instructor"
        v-model="formData.internship.instructor"
        class="h-12 text-base"
        placeholder="نام استاد"
        autocomplete="off"
      />
    </MobileField>
    <MobileField label="مورد انضباطی">
      <RadioGroup v-model="disciplinaryCaseValue" class="grid grid-cols-2 gap-3">
        <Label
          for="m-disc-no"
          class="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-input px-4 has-[[data-state=checked]]:border-brand-primary-500 has-[[data-state=checked]]:bg-brand-primary-50"
        >
          <RadioGroupItem id="m-disc-no" value="no" />
          ندارد
        </Label>
        <Label
          for="m-disc-yes"
          class="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-input px-4 has-[[data-state=checked]]:border-brand-primary-500 has-[[data-state=checked]]:bg-brand-primary-50"
        >
          <RadioGroupItem id="m-disc-yes" value="yes" />
          دارد
        </Label>
      </RadioGroup>
    </MobileField>
  </MobileEntryForm>

  <FormSubmissionBanner
    v-if="isSubmitted && !isPrintView && internshipFormStore.trackingNumber"
    :tracking-number="internshipFormStore.trackingNumber"
    :document-link="documentLink"
    @issue="handleIssuance"
  />

  <FormDocumentNotFound v-if="loadFailed" />

  <FormPaperFrame v-if="!isMobileEntry && !loadFailed" :preview="isDesktopEntry" :submitted="isSubmitted">
  <header class="flex justify-between items-start mb-16">
    <figure class="w-1/3">
      <img src="@/assets/images/azad-logo.png" alt="Logo" width="50" class="grayscale" />
    </figure>
    <div class="w-1/3 flex flex-col items-center justify-center gap-2">
      <section class="text-center">
        <p class="font-bold text-base mb-1">بنام خدا</p>
        <p class="text-xs">سرمایه گذاری برای تولید</p>
      </section>
      <section class="font-bold text-sm space-y-1 text-center mt-5">
        <h1>{{ formData.header.university }}</h1>
        <h2 v-if="headerCityLine">{{ headerCityLine }}</h2>
      </section>
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

  <section class="mb-6 text-sm">
    <p class="font-bold mb-3">
      مدیریت محترم
      <Input
        v-if="!showStatic"
        v-model="formData.internship.companyName"
        required
        :highlight="isEditMode"
        class="input"
        placeholder="نام شرکت"
        :size="getInputSize(formData.internship.companyName)"
        :disabled="isInputDisabled"
        :readonly="isInputDisabled"
      />
      <span v-if="showStatic" class="display-value">{{ formData.internship.companyName }}</span>
    </p>
    <p class="font-bold">سلام علیکم</p>
  </section>

  <section class="text-xs font-medium px-2">
    <div :class="!isSubmitted ? 'leading-12' : 'leading-10'">
      احتراما بدینوسیله
      <span class="display-value">{{ formData.student.fullName }}</span>
      دانشجوی رشته <span class="display-value">{{ formData.education.field }}</span> مقطع
      <span class="display-value">{{ formData.education.degreeType }}</span> با سیستم آموزش
      <span class="display-value">{{ formData.education.system }}</span> ورودی
      <span class="display-value">{{ formData.education.entryAcademicYear }}</span> به شماره دانشجویی
      <span class="display-value">{{ formData.student.code }}</span>
      جهت انجام
      <Input
        v-if="!showStatic"
        v-model="formData.internship.course"
        required
        :highlight="isEditMode"
        class="input"
        placeholder="دوره کارآموزی"
        :size="getInputSize(formData.internship.course, 10)"
        :disabled="isInputDisabled"
        :readonly="isInputDisabled"
      />
      <span v-if="showStatic" class="display-value">{{ formData.internship.course }}</span>
      به مدت
      <Input
        v-if="!showStatic"
        v-model="formData.internship.duration"
        required
        :highlight="isEditMode"
        class="input"
        placeholder="زمان به ساعت"
        numeric
        :size="getInputSize(formData.internship.duration, 9)"
        :disabled="isInputDisabled"
        :readonly="isInputDisabled"
      />
      <span v-if="showStatic" class="display-value">{{ formData.internship.duration }}</span>
      ساعت معرفی می نماید.
    </div>

    <div class="leading-10">
      استاد درس کارآموزی ایشان
      <Input
        v-if="!showStatic"
        v-model="formData.internship.instructor"
        required
        :highlight="isEditMode"
        class="input"
        placeholder="نام استاد"
        :size="getInputSize(formData.internship.instructor, 6)"
        :disabled="isInputDisabled"
        :readonly="isInputDisabled"
      />
      <span v-if="showStatic" class="display-value">{{ formData.internship.instructor }}</span>
      عضو هیئت علمی این واحد دانشگاهی می باشد.
    </div>

    <section class="leading-10">
      خواهشمند است دستور فرمائید با تعیین سرپرست کارآموزی وی در آن واحد اقدامات مقتضی بعمل آمده و در
      پایان دوره فرم پیوست را تکمیل و در پاکت در بسته به این واحد دانشگاهی ارسال فرمایند. در ضمن خاطر
      نشان می سازد که دانشجوی معرفی شده موظف به اجرای کلیه مقررات انضباطی آن واحد می باشد. همکاری
      ارزنده آن مقام محترم در پذیرش کارآموز و در صورت لزوم اجازه و امکان بازدید استاد کارآموزی موجب
      کمال امتنان و سپاسگزاری است. طبق بخشنامه
      <span class="display-value">47/16000</span>
      مورخ
      <span class="display-value">86/06/15</span>
      کلیه دانشجویان در طول مدت کارآموزی تحت پوشش بیمه حوادث دانشجویی می باشند.
    </section>

    <div class="border border-neutral-800 py-3 px-4 mt-4">
      <section :class="isSubmitted ? 'space-y-3' : 'space-y-2'">
        <div>
          آدرس محل کارآموزی:
          <Textarea
            v-if="!showStatic"
            v-model="formData.internship.address"
            required
            :highlight="isEditMode"
            :disabled="isInputDisabled"
            :readonly="isInputDisabled"
            class="resize-none font-bold placeholder:font-medium mt-2"
            placeholder="آدرس را اینجا وارد کنید..."
          />
          <span v-if="showStatic" class="display-value">{{ formData.internship.address }}</span>
        </div>
        <div>
          کدپستی:
          <Input
            v-if="!showStatic"
            v-model="formData.internship.postalCode"
            required
            :highlight="isEditMode"
            class="input"
            placeholder="کد پستی"
            numeric
            :size="getInputSize(formData.internship.postalCode, 8)"
            :disabled="isInputDisabled"
            :readonly="isInputDisabled"
          />
          <span v-if="showStatic" class="display-value">{{ formData.internship.postalCode }}</span>
        </div>
        <div>
          <Input
            v-if="!showStatic"
            v-model="formData.internship.department"
            required
            :highlight="isEditMode"
            class="input"
            placeholder="دپارتمان / واحد"
            :size="getInputSize(formData.internship.department)"
            :disabled="isInputDisabled"
            :readonly="isInputDisabled"
          />
          <span v-if="showStatic" class="display-value">{{ formData.internship.department }}</span>
        </div>
      </section>

      <section class="flex items-center gap-4 mt-6">
        <span>مورد انضباطی :</span>
        <div v-if="!showStatic" class="flex items-center gap-4">
          <RadioGroup
            v-model="disciplinaryCaseValue"
            :disabled="isInputDisabled"
            class="flex items-center gap-4"
          >
            <div class="flex items-center gap-2">
              <RadioGroupItem id="disciplinary-yes" value="yes" />
              <Label for="disciplinary-yes" class="cursor-pointer">دارد</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="disciplinary-no" value="no" />
              <Label for="disciplinary-no" class="cursor-pointer">ندارد</Label>
            </div>
          </RadioGroup>
        </div>
        <div v-else class="flex items-center gap-5">
          <span
            class="disciplinary-option"
            :class="{ 'is-selected': !formData.internship.disciplinarian }"
          >
            <span
              class="disciplinary-box"
              :aria-label="formData.internship.disciplinarian ? 'ندارد (انتخاب‌نشده)' : 'ندارد'"
            >
              <span v-if="!formData.internship.disciplinarian" aria-hidden="true">✓</span>
            </span>
            <span>ندارد</span>
          </span>
          <span
            class="disciplinary-option"
            :class="{ 'is-selected': formData.internship.disciplinarian }"
          >
            <span
              class="disciplinary-box"
              :aria-label="formData.internship.disciplinarian ? 'دارد' : 'دارد (انتخاب‌نشده)'"
            >
              <span v-if="formData.internship.disciplinarian" aria-hidden="true">✓</span>
            </span>
            <span>دارد</span>
          </span>
        </div>
      </section>
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
.disciplinary-option {
  @apply inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5;
}
.disciplinary-option.is-selected {
  @apply bg-neutral-200;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
.disciplinary-box {
  @apply inline-flex size-[1.1em] shrink-0 items-center justify-center border border-neutral-900 text-[0.75em] font-bold leading-none;
}
</style>
