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
      students: {
        checkStudent: (studentNumber: string) =>
          `${baseUrl}/students/check-student/${studentNumber}/`,
      },
      education: {
        get: (trackingNumber: string) => `${baseUrl}/education/${trackingNumber}/`,
        submit: `${baseUrl}/education/`,
      },
      internship: {
        get: (trackingNumber: string) => `${baseUrl}/intern/${trackingNumber}/`,
        submit: `${baseUrl}/intern/`,
      },
      etela: {
        get: (trackingNumber: string) => `${baseUrl}/etela/${trackingNumber}/`,
        submit: `${baseUrl}/etela/create/`,
      },
    },

    contact: {
      create: `${baseUrl}/ticket/create/`,
    },
  };

  return { apiEndpoints };
};
