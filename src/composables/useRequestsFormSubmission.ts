import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { useEducationApi } from "@/composables/api/useEducationApi";
import { useInternshipApi } from "@/composables/api/useInternshipApi";
import { useEducationFormStore } from "@/stores/education/useEducationFormStore";
import { useInternshipFormStore } from "@/stores/internship/useInternshipFormStore";
import type { EducationFormData } from "@/types/requests/education";
import type { InternshipFormData } from "@/types/requests/internship";
import { useEtelaApi } from "@/composables/api/useEtelaApi";
import { useEtelaFormStore } from "@/stores/etela/useEtelaFromStore";
import type { EtelaFormData } from "@/types/requests/etela";

export function useRequestsFormSubmission(
  validateForm: () => boolean,
  requestType: "education" | "internship" | "etela",
) {
  const isEditMode = ref(true);
  const isSubmitted = ref(false);
  const isSubmitting = ref(false);
  const isFormValid = computed(() => validateForm());

  const etelaFormStore = useEtelaFormStore();
  const { submitEtelaCertificate } = useEtelaApi();
  const educationFormStore = useEducationFormStore();
  const internshipFormStore = useInternshipFormStore();
  const { submitEducationCertificate } = useEducationApi();
  const { submitInternshipLetter } = useInternshipApi();

  async function handleSubmit(formData?: EducationFormData | InternshipFormData | EtelaFormData) {
    if (!isFormValid.value || isSubmitting.value || !formData) return;

    isSubmitting.value = true;

    try {
      let trackingNumber: string;
      switch (requestType) {
        case "education":
          trackingNumber = await submitEducationCertificate(
            educationFormStore.transformFormDataToRequest(formData as EducationFormData),
          );
          educationFormStore.setTrackingNumber(trackingNumber);
          break;

        case "internship":
          trackingNumber = await submitInternshipLetter(
            internshipFormStore.transformFormDataToRequest(formData as InternshipFormData),
          );
          internshipFormStore.setTrackingNumber(trackingNumber);
          break;
        case "etela":
          trackingNumber = await submitEtelaCertificate(
            etelaFormStore.transformFormDataToRequest(formData as EtelaFormData),
          );
          etelaFormStore.setTrackingNumber(trackingNumber);
          break;
        default:
          throw new Error("Invalid request type");
      }

      isSubmitted.value = true;
      isEditMode.value = false;

      toast.success("اطلاعات با موفقیت ثبت شد.", {
        description: "اطلاعات مورد نظر با موفقیت ثبت شد و درخواست شما آماده چاپ است.",
        richColors: true,
      });
    } catch (error: any) {
      toast.error("خطا در ثبت اطلاعات", {
        description: error.extractedMessage || "خطا در ارتباط با سرور",
        richColors: true,
      });
    } finally {
      isSubmitting.value = false;
    }
  }

  function resetForm() {
    isSubmitted.value = false;
    isEditMode.value = true;
  }

  return {
    isEditMode,
    isSubmitted,
    isSubmitting,
    isFormValid,
    handleSubmit,
    resetForm,
  };
}