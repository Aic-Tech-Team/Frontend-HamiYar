import { apiConfig } from "@/config";

export const useApiConfig = () => {
  const baseUrl = apiConfig.baseUrl;
  const apiEndpoints = {
    // * Account related Endpoints
    account: {
      auth: {
        login: `${baseUrl}/token/`,
        logout: `${baseUrl}/logout/`,
        refreshToken: `${baseUrl}/token/refresh/`,
      },
    },

    // * Requests related Endpoints
    requests: {
      checkStudent: (studentNumber: string) => `${baseUrl}/check-student/${studentNumber}/`,
      education: {
        get: (trackingNumber: string) => `${baseUrl}/education/${trackingNumber}/`,
        submit: `${baseUrl}/education/`,
      },
      internship: {
        get: (trackingNumber: string) => `${baseUrl}/intern/${trackingNumber}/`,
        submit: `${baseUrl}/intern/`,
      },
    },

    contact: {
      create: `${baseUrl}/ticket/create/`,
    },
  };

  return { apiEndpoints };
};
