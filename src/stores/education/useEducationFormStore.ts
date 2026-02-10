import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type {
  EducationCertificateResponse,
  EducationFormData,
  EducationCertificateRequestModel,
} from "@/types/requests/education";

import { useDate } from "@/composables/useDate";

const { formatIsoToJalali } = useDate();

/**
 * Get default form data structure
 */
function getDefaultFormData(): EducationFormData {
  return {
    header: {
      university: "نام دانشگاه",
      city: "شهر | واحد",
      date: "-",
      number: "-",
      attachment: "-",
    },
    student: {
      code: "",
      fullName: "",
      fatherName: "",
      idNumber: "",
      birthPlace: "",
      birthDate: "",
      photoUrl: "",
    },
    education: {
      field: "",
      degreeType: "",
      method: "",
      entrySemester: "",
      entryAcademicYear: "",
      currentSemester: "",
      currentAcademicYear: "",
    },
    certificate: {
      recipient: "",
      validityDate: "",
    },
    description: "",
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
function transformApiResponseToFormData(
  apiResponse: EducationCertificateResponse,
): EducationFormData {
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
      fatherName: student.father_name || "",
      idNumber: student.certificate_number || student.national_id || "",
      birthPlace: student.issued_by || "",
      birthDate: formatIsoToJalali(student.birth_date),
      photoUrl: "",
    },
    education: {
      field: student.field_of_study || "",
      degreeType: student.education_level || "",
      method: student.education_system || "",
      entrySemester: student.entry_term || "",
      entryAcademicYear: student.entry_year || "",
      currentSemester: apiResponse.academic_term || "",
      currentAcademicYear: apiResponse.academic_year || "",
    },
    certificate: {
      recipient: apiResponse.certificate || "",
      validityDate: apiResponse.expiration_date || "",
    },
    description: apiResponse.description || "",
    signature: {
      title: signer?.title || "",
      name: signer?.full_name || "",
      imageUrl: signer?.signature_image || "",
    },
  };
}

export const useEducationFormStore = defineStore("educationForm", () => {
  // Private state
  const _formData = ref<EducationFormData | null>(null);
  const _rawApiResponse = ref<EducationCertificateResponse | null>(null);
  const _trackingNumber = ref<string | null>(null);

  function setTrackingNumber(value: string | null) {
    _trackingNumber.value = value;
  }

  function setFormDataFromApi(apiResponse: EducationCertificateResponse): void {
    _rawApiResponse.value = apiResponse;
    _formData.value = transformApiResponseToFormData(apiResponse);
    if (apiResponse.tracking_number) _trackingNumber.value = apiResponse.tracking_number;
  }

  function transformFormDataToRequest(
    formData: EducationFormData,
  ): EducationCertificateRequestModel {
    return {
      student_number: formData.student.code || "",
      academic_term: formData.education.currentSemester || "",
      academic_year: formData.education.currentAcademicYear || "",
      certificate: formData.certificate.recipient || "",
      description: formData.description || "",
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
