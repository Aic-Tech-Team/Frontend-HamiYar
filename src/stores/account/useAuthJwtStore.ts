import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAuthJwtStore = defineStore("authJwt", () => {
  // Private State
  const _accessToken = ref<string | null>(localStorage.getItem("access_token"));
  const _refreshToken = ref<string | null>(localStorage.getItem("refresh_token"));

  const isAuthenticated = computed(() => !!_accessToken.value);

  function setTokens(newAccessToken: string, newRefreshToken: string) {
    // Update state
    _accessToken.value = newAccessToken;
    _refreshToken.value = newRefreshToken;

    // Sync with localStorage
    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", newRefreshToken);
  }

  function clearTokens() {
    // Clear state
    _accessToken.value = null;
    _refreshToken.value = null;

    // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  return {
    accessToken: computed(() => _accessToken.value),
    refreshToken: computed(() => _refreshToken.value),

    isAuthenticated,

    setTokens,
    clearTokens,
  };
});
