interface ApiConfig {
  apiBaseUrl: string;
  apiPrefix: string;
  apiVersion: string;
  baseUrl: string;
}

const getApiConfig = (): ApiConfig => {
  const { VITE_API_BASE_URL } = import.meta.env as {
    VITE_API_BASE_URL?: string;
  };

  const apiBaseUrlRaw = VITE_API_BASE_URL ?? "";
  // Remove trailing slashes
  const apiBaseUrl = apiBaseUrlRaw.replace(/\/+$/, "");
  const apiPrefix = "/api";
  const apiVersion = "1.0";
  const baseUrl = `${apiBaseUrl}${apiPrefix}`;

  return { apiBaseUrl, apiPrefix, apiVersion, baseUrl };
};

export const apiConfig = getApiConfig();
