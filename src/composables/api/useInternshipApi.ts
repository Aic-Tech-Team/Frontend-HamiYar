import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type {
  InternshipResponse,
  InternshipRequestModel,
} from "@/types/requests/internship";
import type { SubmitFormResponse } from "@/types/requests/common";

export const useInternshipApi = () => {
  const { apiEndpoints } = useApiConfig();

  async function getInternshipLetter(trackingNumber: string): Promise<InternshipResponse> {
    const trimmed = trackingNumber?.trim();
    if (!trimmed) throw new Error("Invalid tracking number");

    const response = await $api.get<InternshipResponse>(
      apiEndpoints.requests.internship.get(trimmed)
    );
    if (!response.data) throw new Error("No data received from API");
    return response.data;
  }

  async function submitInternshipLetter(
    requestData: InternshipRequestModel,
  ): Promise<string> {
    const response = await $api.post<SubmitFormResponse>(
      apiEndpoints.requests.internship.submit,
      requestData
    );
    if (!response.data) throw new Error("No data received from API");

    return response.data.tracking_number;
  }

  return {
    getInternshipLetter,
    submitInternshipLetter,
  };
};
