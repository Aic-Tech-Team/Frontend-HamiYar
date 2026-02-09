import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type {
  EducationCertificateResponse,
  EducationCertificateRequestModel,
} from "@/types/requests/education";
import type { SubmitFormResponse } from "@/types/requests/common";

export const useEducationApi = () => {
  const { apiEndpoints } = useApiConfig();

  async function getEducationCertificate(
    trackingNumber: string,
  ): Promise<EducationCertificateResponse> {
    const trimmed = trackingNumber?.trim();
    if (!trimmed) throw new Error("Invalid tracking number");

    const response = await $api.get<EducationCertificateResponse>(
      apiEndpoints.requests.education.get(trimmed),
    );
    if (!response.data) throw new Error("No data received from API");
    return response.data;
  }

  async function submitEducationCertificate(
    requestData: EducationCertificateRequestModel,
  ): Promise<string> {
    const response = await $api.post<SubmitFormResponse>(
      apiEndpoints.requests.education.submit,
      requestData,
    );
    if (!response.data) throw new Error("No data received from API");

    return response.data.tracking_number;
  }

  return {
    getEducationCertificate,
    submitEducationCertificate,
  };
};
