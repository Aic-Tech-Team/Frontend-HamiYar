import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type { CheckStudentResponse } from "@/types/requests/student";

export const useStudentApi = () => {
  const { apiEndpoints } = useApiConfig();

  async function checkStudent(identifier: string, type: "student" | "national" = "student"): Promise<CheckStudentResponse> {
    if (type === "national") throw new Error("National ID lookup not yet implemented");

    const trimmed = identifier?.trim();
    if (!trimmed) throw new Error("Invalid identifier");

    const url = apiEndpoints.requests.students.checkStudent(trimmed);

    const response = await $api.get<CheckStudentResponse>(url);
    const checkStudentResponse = response.data;

    if (!checkStudentResponse) throw new Error("No data received from API");
    
    return checkStudentResponse;
  }

  return {
    checkStudent,
  };
};

