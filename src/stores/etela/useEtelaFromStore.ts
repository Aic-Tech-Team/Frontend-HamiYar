import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type {
  EtelaCertificateResponse,
  EtelaFormData,
  EtelaCertificateRequestModel,
} from "@/types/requests/etela";

import { useDate } from "@/composables/useDate";

const { formatIsoToJalali } = useDate();

/**
 * Get default form data structure
 */
function getDefaultFormData(): EtelaFormData {
  return {
    header: {
      university: "نام دانشگاه",
      city: "شهر | واحد",
      date: "-",
      number: "-",
      attachment: "",
    },
    student: {
      code: "",
      fullName: "",
      idNumber: "",
      photoUrl: "",
    },
    completionDate: "",
    signature: {
      title: "",
      name: "",
      imageUrl: "",
    },
  };
}

/**
 * Transform API response to form data structure
 */
function transformApiResponseToFormData(apiResponse: EtelaCertificateResponse): EtelaFormData {
  const { student, signer } = apiResponse;

  return {
    header: {
      university: student.university?.name || "",
      city: student.university?.city || "",
      date: formatIsoToJalali(apiResponse.date) || "-",
      number: apiResponse.tracking_number || "-",
      attachment: "-",
    },
    student: {
      code: student.student_number || "",
      fullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
      idNumber: student.certificate_number || student.national_id || "",
      photoUrl: "",
    },
    completionDate: apiResponse.completion_date || "",
    signature: {
      title: signer?.title || "",
      name: signer?.full_name || "",
      imageUrl: signer?.signature_image || "",
    },
  };
}

export const useElaFormStore = defineStore("elaForm", () => {
  // Private state
  const _formData = ref<EtelaFormData | null>(null);
  const _rawApiResponse = ref<EtelaCertificateResponse | null>(null);
  const _trackingNumber = ref<string | null>(null);

  function setTrackingNumber(value: string | null) {
    _trackingNumber.value = value;
  }

  function setFormDataFromApi(apiResponse: EtelaCertificateResponse): void {
    _rawApiResponse.value = apiResponse;
    _formData.value = transformApiResponseToFormData(apiResponse);
    if (apiResponse.tracking_number) _trackingNumber.value = apiResponse.tracking_number;
  }

  function transformFormDataToRequest(formData: EtelaFormData): EtelaCertificateRequestModel {
    return {
      student_number: formData.student.code || "",
      completion_date: formData.completionDate || "",
    };
  }

  return {
    formData: computed(() => _formData.value),
    rawApiResponse: computed(() => _rawApiResponse.value),
    trackingNumber: computed(() => _trackingNumber.value),
    getDefaultFormData,
    setFormDataFromApi,
    setTrackingNumber,
    transformFormDataToRequest,
  };
});
