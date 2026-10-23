import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type { OverviewCountResponse } from "@/types/requests/overview";

export const useOverviewApi = () => {
  const { apiEndpoints } = useApiConfig();

  async function getCount(url: string): Promise<number> {
    const response = await $api.get<OverviewCountResponse>(url);
    if (!response.data) throw new Error("No data received from API");
    return response.data.count;
  }

  async function getEducationOverviewCount(): Promise<number> {
    return getCount(apiEndpoints.requests.education.overviewCount);
  }

  async function getInternshipOverviewCount(): Promise<number> {
    return getCount(apiEndpoints.requests.internship.overviewCount);
  }

  async function getEtelaOverviewCount(): Promise<number> {
    return getCount(apiEndpoints.requests.etela.overviewCount);
  }

  async function getTicketOverviewCount(): Promise<number> {
    return getCount(apiEndpoints.contact.overviewCount);
  }

  return {
    getEducationOverviewCount,
    getInternshipOverviewCount,
    getEtelaOverviewCount,
    getTicketOverviewCount,
  };
};
