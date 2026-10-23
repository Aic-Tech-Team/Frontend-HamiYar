import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type {
  EducationCertificateResponse,
  EducationCertificateRequestModel,
  EducationCertificateCreateResponse,
} from "@/types/requests/education";

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
    const response = await $api.post<EducationCertificateCreateResponse>(
      apiEndpoints.requests.education.submit,
      requestData,
    );
    if (!response.data?.tracking_number) throw new Error("No data received from API");

    return response.data.tracking_number;
  }

  return {
    getEducationCertificate,
    submitEducationCertificate,
  };
};
