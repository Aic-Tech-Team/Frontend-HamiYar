import { useRouter } from "vue-router";
import $api from "@/utils/api";
import { useApiConfig } from "@/composables/api/useApiConfig";
import { useAuthJwtStore } from "@/stores/account/useAuthJwtStore";
import type { LoginResponse, AuthRequestModal } from "@/types/account/auth";

export const useAuthApi = () => {
  const { apiEndpoints } = useApiConfig();
  const router = useRouter();
  const authStore = useAuthJwtStore();
  const { login: loginUrl, logout: logoutUrl } = apiEndpoints.account.auth;

  async function loginAsync(loginRequestModel: AuthRequestModal): Promise<void> {
    const response = await $api.post<LoginResponse>(loginUrl, loginRequestModel);

    const loginResponse = response.data;

    if (!loginResponse) return;

    authStore.setTokens(loginResponse.access, loginResponse.refresh);
  }

  async function logoutAsync(shouldNavigate = true): Promise<void> {
    try {
      const refreshToken = authStore.refreshToken;
      authStore.clearTokens();
      if (shouldNavigate) router.push("/login");

      await $api.post(logoutUrl, { refresh: refreshToken });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  return {
    loginAsync,
    logoutAsync,
  };
};
