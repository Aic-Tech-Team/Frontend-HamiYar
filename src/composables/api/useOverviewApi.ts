import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type { OverviewCountResponse } from "@/types/requests/overview";

export const useOverviewApi = () => {
  const { apiEndpoints } = useApiConfig();

  async function getEducationOverviewCount(): Promise<number> {
    const response = await $api.get<OverviewCountResponse>(
      apiEndpoints.requests.education.overviewCount,
    );
    if (!response.data) throw new Error("No data received from API");

    return response.data.count;
  }

  return {
    getEducationOverviewCount,
  };
};