import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type {
  EtelaCertificateResponse,
  EtelaFormData,
  EtelaCertificateRequestModel,
} from "@/types/requests/etela";

import { useDate } from "@/composables/useDate";

const { formatIsoToJalali } = useDate();

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
    gender: "",
    courseDate: "",
    certificate: "",
    description: "",
    signature: {
      title: "",
      name: "",
      imageUrl: "",
    },
  };
}

function transformApiResponseToFormData(apiResponse: EtelaCertificateResponse): EtelaFormData {
  const { student, signer } = apiResponse;

  return {
    header: {
      university: student.university?.name || "",
      city: student.university?.city || "",
      date: formatIsoToJalali(apiResponse.date) || "-",
      number: apiResponse.tracking_number?.replace(/^ETELA-/, "") || "-",
      attachment: "-",
    },
    student: {
      code: student.student_number || "",
      fullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
      idNumber: student.national_id || student.certificate_number || "",
      photoUrl: "",
    },
    gender: apiResponse.gender || "",
    courseDate: apiResponse.course_date || "",
    certificate: apiResponse.certificate || student.certificate_number || "",
    description: apiResponse.description || "",
    signature: {
      title: signer?.title || "",
      name: signer?.full_name || "",
      imageUrl: signer?.signature_image || "",
    },
  };
}

export const useEtelaFormStore = defineStore("etelaForm", () => {
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
    if (formData.gender !== "female" && formData.gender !== "male") {
      throw new Error("gender is required");
    }

    return {
      student_number: formData.student.code || "",
      gender: formData.gender,
      course_date: formData.courseDate || "",
      certificate: formData.certificate || undefined,
      description: formData.description || undefined,
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
