import { apiConfig } from "@/config";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

import router from "@/router";
import { useApiConfig } from "@/composables/api/useApiConfig";
import { useAuthApi } from "@/composables/api/useAuthApi";
import { useAuthJwtStore } from "@/stores/account/useAuthJwtStore.ts";

import type { AxiosError } from "axios";
import type { RefreshResponse } from "@/types/account/auth";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthJwtStore();
  const token = authStore.accessToken;

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

async function doRefreshToken(failedRequest: AxiosError) {
  const { logoutAsync } = useAuthApi();
  const { apiEndpoints } = useApiConfig();
  const authStore = useAuthJwtStore();

  const currentRefreshToken = authStore.refreshToken;

  try {
    const response = await axios.post<RefreshResponse>(apiEndpoints.account.auth.refreshToken, {
      refresh: currentRefreshToken,
    });

    const newAccessToken = response.data.access;
    const newRefreshToken = response.data.refresh || (currentRefreshToken as string);

    if (!newAccessToken) {
      throw new Error("Invalid token response");
    }

    authStore.setTokens(newAccessToken, newRefreshToken);

    if (failedRequest.response?.config) {
      failedRequest.response.config.headers.Authorization = `Bearer ${newAccessToken}`;
    }

    return Promise.resolve();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status && status >= 400 && status < 500) {
        await logoutAsync();
      }
    }

    return Promise.reject(error);
  }
}

// Setup auth refresh interceptor
createAuthRefreshInterceptor(axiosInstance, doRefreshToken);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { logoutAsync } = useAuthApi();

    if (error.response?.status === 401) {
      await logoutAsync();
    }

    // Global redirect for any 5xx server error
    if (error.response?.status >= 500 && error.response?.status < 600) {
      router.replace({ name: "Error", params: { code: "500" } });
    }

    // Standardize error messages
    if (error.response?.data) {
      const data = error.response.data;
      let extractedMessages: string[] = [];

      if (Array.isArray(data)) {
        // Handle direct array: ["error message"]
        extractedMessages = data;
      } else if (typeof data === "object") {
        // Handle object with common fields
        const possibleFields = ["messages", "message", "detail", "error"];
        for (const field of possibleFields) {
          if (data[field]) {
            extractedMessages = Array.isArray(data[field]) ? data[field] : [data[field]];
            break;
          }
        }
      }

      // Fallback if no specific field found but data is string
      if (extractedMessages.length === 0 && typeof data === "string") {
        extractedMessages = [data];
      }

      // Attach to error object for easy access in components
      error.extractedMessage = extractedMessages[0] || "خطایی رخ داده است";
      error.allMessages = extractedMessages;
    }

    return Promise.reject(error);
  },
);

const $api = axiosInstance;
export default $api;
