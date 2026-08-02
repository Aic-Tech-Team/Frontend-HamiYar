import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type {
  EtelaCertificateResponse,
  EtelaCertificateRequestModel,
} from "@/types/requests/etela";
import type { SubmitFormResponse } from "@/types/requests/common";

export const useElaApi = () => {
  const { apiEndpoints } = useApiConfig();

  async function getElaCertificate(trackingNumber: string): Promise<EtelaCertificateResponse> {
    const trimmed = trackingNumber?.trim();
    if (!trimmed) throw new Error("Invalid tracking number");

    const response = await $api.get<EtelaCertificateResponse>(
      apiEndpoints.requests.etela.get(trimmed),
    );
    if (!response.data) throw new Error("No data received from API");
    return response.data;
  }

  async function submitElaCertificate(
    requestData: EtelaCertificateRequestModel,
  ): Promise<string> {
    const response = await $api.post<SubmitFormResponse>(
      apiEndpoints.requests.etela.submit,
      requestData,
    );
    if (!response.data) throw new Error("No data received from API");

    return response.data.tracking_number;
  }

  return {
    getElaCertificate,
    submitElaCertificate,
  };
};