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
          overviewCount: `${base}/overview/count/`,
        };
      })(),

      internship: (() => {
        const base = `${baseUrl}/internship`;

        return {
          get: (trackingNumber: string) => `${base}/${trackingNumber}/`,
          submit: `${base}/create/`,
          overviewCount: `${base}/overview/count/`,
          verify: (trackingNumber: string) => `${base}/verify/${encodeURIComponent(trackingNumber)}/`,
          managerList: `${base}/manager/list/`,
          managerDetail: (id: number) => `${base}/manager/${id}/`,
          managerApprove: (id: number) => `${base}/manager/${id}/approve/`,
        };
      })(),

      etela: (() => {
        const base = `${baseUrl}/etela`;

        return {
          get: (trackingNumber: string) => `${base}/${trackingNumber}/`,
          submit: `${base}/create/`,
          overviewCount: `${base}/overview/count/`,
        };
      })(),
    },

    contact: {
      create: `${baseUrl}/ticket/create/`,
      overviewCount: `${baseUrl}/ticket/overview/count/`,
    },
  };

  return { apiEndpoints };
};