import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import type { ContactRequestModel, ContactSubmitResponse } from "@/types/requests/contact";

export const useContactApi = () => {
  const { apiEndpoints } = useApiConfig();

  async function submitContact(requestData: ContactRequestModel): Promise<string> {
    const formData = new FormData();
    formData.append("phone", requestData.phone);
    formData.append("subject", requestData.subject);
    if (requestData.email) formData.append("email", requestData.email);
    if (requestData.message) formData.append("message", requestData.message);

    const response = await $api.post<ContactSubmitResponse>(apiEndpoints.contact.create, formData);
    if (!response.data) throw new Error("No data received from API");

    return response.data.detail;
  }

  return {
    submitContact,
  };
};