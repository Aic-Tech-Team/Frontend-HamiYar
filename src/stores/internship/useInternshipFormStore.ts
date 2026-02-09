import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type {
  InternshipResponse,
  InternshipFormData,
  InternshipRequestModel,
} from "@/types/requests/internship";
import { useDate } from "@/composables/useDate";

const { formatIsoToJalali } = useDate();

/**
 * Get default form data structure
 */
function getDefaultFormData(): InternshipFormData {
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
    },
    education: {
      field: "",
      entryAcademicYear: "",
      degreeType: "",
      system: "",
    },
    internship: {
      course: "",
      duration: "",
      instructor: "",
      companyName: "",
      address: "",
      postalCode: "",
      department: "",
      disciplinarian: false,
    },
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
function transformApiResponseToFormData(apiResponse: InternshipResponse): InternshipFormData {
  const { student, signer } = apiResponse;

  return {
    header: {
      university: student.university?.name || "",
      city: student.university?.city || "",
      date: formatIsoToJalali(apiResponse.date),
      number: apiResponse.tracking_number || "-",
      attachment: "-",
    },
    student: {
      code: student.student_number || "",
      fullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
    },
    education: {
      field: student.field_of_study || "",
      entryAcademicYear: student.entry_year || "",
      degreeType: student.education_level || "",
      system: student.education_system || "",
    },
    internship: {
      course: apiResponse.course || "",
      duration: apiResponse.time || "",
      instructor: apiResponse.teacher || "",
      companyName: apiResponse.company?.name || "",
      address: apiResponse.company?.address || "",
      postalCode: apiResponse.company?.postal_code || "",
      department: apiResponse.company?.department || "",
      disciplinarian: apiResponse.disciplinarian ?? false,
    },
    signature: {
      title: signer?.title || "",
      name: signer?.full_name || "",
      imageUrl: signer?.signature_image || "",
    },
  };
}

export const useInternshipFormStore = defineStore("internshipForm", () => {
  // Private state
  const _formData = ref<InternshipFormData | null>(null);
  const _rawApiResponse = ref<InternshipResponse | null>(null);
  const _trackingNumber = ref<string | null>(null);

  const formData = computed(() => _formData.value);
  const rawApiResponse = computed(() => _rawApiResponse.value);
  const trackingNumber = computed(() => _trackingNumber.value);

  function setTrackingNumber(value: string | null) {
    _trackingNumber.value = value;
  }

  function setFormDataFromApi(apiResponse: InternshipResponse): void {
    _rawApiResponse.value = apiResponse;
    _formData.value = transformApiResponseToFormData(apiResponse);
    if (apiResponse.tracking_number) _trackingNumber.value = apiResponse.tracking_number;
  }

  function transformFormDataToRequest(formData: InternshipFormData): InternshipRequestModel {
    return {
      student_number: formData.student.code || "",
      company_name: formData.internship.companyName || "",
      company_postal_code: formData.internship.postalCode || "",
      company_address: formData.internship.address || "",
      company_department: formData.internship.department || "",
      time: formData.internship.duration || "",
      course: formData.internship.course || "",
      teacher: formData.internship.instructor || "",
      disciplinarian: formData.internship.disciplinarian ?? false,
    };
  }

  return {
    formData,
    rawApiResponse,
    trackingNumber,
    getDefaultFormData,
    setFormDataFromApi,
    setTrackingNumber,
    transformFormDataToRequest,
  };
});
