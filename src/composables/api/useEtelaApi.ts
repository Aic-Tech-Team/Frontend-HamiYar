import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type {
  EtelaCertificateResponse,
  EtelaCertificateRequestModel,
  EtelaCertificateCreateResponse,
} from "@/types/requests/etela";

export const useEtelaApi = () => {
  const { apiEndpoints } = useApiConfig();

  async function getEtelaCertificate(trackingNumber: string): Promise<EtelaCertificateResponse> {
    const trimmed = trackingNumber?.trim();
    if (!trimmed) throw new Error("Invalid tracking number");

    const response = await $api.get<EtelaCertificateResponse>(
      apiEndpoints.requests.etela.get(trimmed),
    );
    if (!response.data) throw new Error("No data received from API");
    return response.data;
  }

  async function submitEtelaCertificate(
    requestData: EtelaCertificateRequestModel,
  ): Promise<string> {
    const response = await $api.post<EtelaCertificateCreateResponse>(
      apiEndpoints.requests.etela.submit,
      requestData,
    );
    if (!response.data?.tracking_number) throw new Error("No data received from API");
    return response.data.tracking_number;
  }

  return {
    getEtelaCertificate,
    submitEtelaCertificate,
  };
};
