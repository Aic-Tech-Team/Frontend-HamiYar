<script setup lang="ts">
import { computed, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FormViewLayout from "@/components/FormViewLayout.vue";
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

const isPrintView = computed(() => route.meta.mode === "public");
const qrImageSrc = computed(() => internshipFormStore.rawApiResponse?.qr_code_image);
const formData = reactive(internshipFormStore.getDefaultFormData());

// Prefill from student store
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

// Load public data
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
  () => internshipFormStore.formData,
  (storeData) => {
    if (storeData) Object.assign(formData, storeData);
  },
  { immediate: false },
);

// Validation - only fields we send in POST
function validateForm() {
  const required = [
    formData.student.code,
    formData.internship.companyName,
    formData.internship.address,
    formData.internship.postalCode,
    formData.internship.duration,
    formData.internship.instructor,
    formData.internship.department,
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
} = useRequestsFormSubmission(validateForm, "internship");

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
  window.open(routeData.href, "_blank");
}

const isInputDisabled = computed(() => isSubmitted.value || !isEditMode.value);
const disciplinaryCaseValue = computed({
  get: () => (formData.internship.disciplinarian ? "yes" : "no"),
  set: (value: string) => {
    formData.internship.disciplinarian = value === "yes";
  },
});
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
            <h1>{{ formData.header.university }} ({{ formData.header.city }})</h1>
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
    </template>

    <template #body>
      <section class="mb-6 text-sm">
        <p class="font-bold mb-3">
          مدیریت محترم
          <Input
            v-if="!isPrintView"
            v-model="formData.internship.companyName"
            required
            :highlight="isEditMode"
            class="input"
            placeholder="نام شرکت"
            :size="getInputSize(formData.internship.companyName)"
            :disabled="isInputDisabled"
            :readonly="isInputDisabled"
          />
          <span v-if="isPrintView" class="display-value">{{
            formData.internship.companyName
          }}</span>
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
          <span class="display-value">{{ formData.education.entryAcademicYear }}</span> به شماره
          دانشجویی <span class="display-value">{{ formData.student.code }}</span>
          جهت انجام
          <Input
            v-if="!isPrintView"
            v-model="formData.internship.course"
            required
            :highlight="isEditMode"
            class="input"
            placeholder="دوره کارآموزی"
            :size="getInputSize(formData.internship.course, 10)"
            :disabled="isInputDisabled"
            :readonly="isInputDisabled"
          />
          <span v-if="isPrintView" class="display-value">{{ formData.internship.course }}</span>
          به مدت
          <Input
            v-if="!isPrintView"
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
          <span v-if="isPrintView" class="display-value">{{ formData.internship.duration }}</span>
          ساعت معرفی می نماید.
        </div>

        <div class="leading-10">
          استاد درس کارآموزی ایشان
          <Input
            v-if="!isPrintView"
            v-model="formData.internship.instructor"
            required
            :highlight="isEditMode"
            class="input"
            placeholder="نام استاد"
            :size="getInputSize(formData.internship.instructor, 6)"
            :disabled="isInputDisabled"
            :readonly="isInputDisabled"
          />
          <span v-if="isPrintView" class="display-value">{{ formData.internship.instructor }}</span>
          عضو هیئت علمی این واحد دانشگاهی می باشد.
        </div>

        <section class="leading-10">
          خواهشمند است دستور فرمائید با تعیین سرپرست کارآموزی وی در آن واحد اقدامات مقتضی بعمل آمده
          و در پایان دوره فرم پیوست را تکمیل و در پاکت در بسته به این واحد دانشگاهی ارسال فرمایند.
          در ضمن خاطر نشان می سازد که دانشجوی معرفی شده موظف به اجرای کلیه مقررات انضباطی آن واحد می
          باشد. همکاری ارزنده آن مقام محترم در پذیرش کارآموز و در صورت لزوم اجازه و امکان بازدید
          استاد کارآموزی موجب کمال امتنان و سپاسگزاری است. طبق بخشنامه
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
                v-if="!isPrintView"
                v-model="formData.internship.address"
                required
                :highlight="isEditMode"
                :disabled="isInputDisabled"
                :readonly="isInputDisabled"
                class="resize-none font-bold placeholder:font-medium mt-2"
                placeholder="آدرس را اینجا وارد کنید..."
              />
              <span v-if="isPrintView" class="display-value">{{
                formData.internship.address
              }}</span>
            </div>
            <div>
              کدپستی:
              <Input
                v-if="!isPrintView"
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
              <span v-if="isPrintView" class="display-value">{{
                formData.internship.postalCode
              }}</span>
            </div>
            <div>
              <Input
                v-if="!isPrintView"
                v-model="formData.internship.department"
                required
                :highlight="isEditMode"
                class="input"
                placeholder="دپارتمان / واحد"
                :size="getInputSize(formData.internship.department)"
                :disabled="isInputDisabled"
                :readonly="isInputDisabled"
              />
              <span v-if="isPrintView" class="display-value">{{
                formData.internship.department
              }}</span>
            </div>
          </section>

          <section class="flex items-center gap-4 mt-6">
            <span>مورد انضباطی :</span>
            <div v-if="!isPrintView" class="flex items-center gap-4">
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
            <div v-else class="flex items-center gap-4">
              <label
                class="flex items-center gap-2"
                :class="{
                  'bg-neutral-200 py-1 px-2 rounded-md': !formData.internship.disciplinarian,
                }"
              >
                <span class="display-value">{{
                  formData.internship.disciplinarian ? "" : "✓"
                }}</span>
                <span>ندارد</span>
              </label>
              <label
                class="flex items-center gap-2"
                :class="{
                  'py-1 px-2 rounded-md': formData.internship.disciplinarian,
                }"
              >
                <span class="display-value">{{
                  formData.internship.disciplinarian ? "✓" : ""
                }}</span>
                <span>دارد</span>
              </label>
            </div>
          </section>
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
