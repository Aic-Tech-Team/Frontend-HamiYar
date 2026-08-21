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
      
      education: (() => {
        const base = `${baseUrl}/requests/education`;

        return {
          get: (trackingNumber: string) => `${base}/${trackingNumber}/`,
          submit: `${base}/`,
        };
      })(),

      internship: (() => {
        const base = `${baseUrl}/intern`;

        return {
          get: (trackingNumber: string) => `${base}/${trackingNumber}/`,
          submit: `${base}/`,
        };
      })(),

      etela: (() => {
        const base = `${baseUrl}/etela`;

        return {
          get: (trackingNumber: string) => `${base}/${trackingNumber}/`,
          submit: `${base}/create/`,
        };
      })(),
    },

    contact: {
      create: `${baseUrl}/ticket/create/`,
    },
  };

  return { apiEndpoints };
};
