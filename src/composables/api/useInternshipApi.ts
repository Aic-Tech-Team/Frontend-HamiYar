import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type {
  InternshipResponse,
  InternshipRequestModel,
  InternshipCreateResponse,
  InternshipManagerListItem,
  InternshipManagerDetail,
  InternshipApprovalResult,
  InternshipVerification,
} from "@/types/requests/internship";

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
    const response = await $api.post<InternshipCreateResponse>(
      apiEndpoints.requests.internship.submit,
      requestData
    );
    if (!response.data?.tracking_number) throw new Error("No data received from API");

    return response.data.tracking_number;
  }

  async function verifyInternship(trackingNumber: string): Promise<InternshipVerification> {
    const response = await $api.get<InternshipVerification>(
      apiEndpoints.requests.internship.verify(trackingNumber),
    );
    return response.data;
  }

  async function listManagerInternships(status?: string): Promise<InternshipManagerListItem[]> {
    type ListPage = InternshipManagerListItem[] | {
      results: InternshipManagerListItem[];
      next?: string | null;
    };
    const results: InternshipManagerListItem[] = [];
    let nextUrl: string | null = apiEndpoints.requests.internship.managerList;
    let first = true;
    const seen = new Set<string>();

    while (nextUrl && !seen.has(nextUrl)) {
      seen.add(nextUrl);
      const response = await $api.get<ListPage>(nextUrl, {
        params: first && status && status !== "all" ? { status } : undefined,
      });
      first = false;
      if (Array.isArray(response.data)) {
        results.push(...response.data);
        break;
      }
      results.push(...response.data.results);
      nextUrl = response.data.next || null;
    }
    return results;
  }

  async function getManagerInternship(id: number): Promise<InternshipManagerDetail> {
    const response = await $api.get<InternshipManagerDetail>(
      apiEndpoints.requests.internship.managerDetail(id),
    );
    return response.data;
  }

  async function approveManagerInternship(id: number): Promise<InternshipApprovalResult> {
    const response = await $api.post<InternshipApprovalResult>(
      apiEndpoints.requests.internship.managerApprove(id),
      { approved: true },
    );
    return response.data;
  }

  return {
    getInternshipLetter,
    submitInternshipLetter,
    verifyInternship,
    listManagerInternships,
    getManagerInternship,
    approveManagerInternship,
  };
};
