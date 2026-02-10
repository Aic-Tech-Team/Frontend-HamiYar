import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { UserRole } from "@/types/account/role";

export const useUserRoleStore = defineStore("userRole", () => {
  // Private State
  const _userRole = ref<UserRole | null>((localStorage.getItem("user_role") as UserRole) || null);

  const isSystemAdmin = computed(() => _userRole.value === "SystemAdmin");
  const isAdmin = computed(() => _userRole.value === "Admin");
  const isUser = computed(() => _userRole.value === "User");
  const isGuest = computed(() => _userRole.value === "Guest");

  const hasAdminAccess = computed(() => isSystemAdmin.value || isAdmin.value);

  // Helpers
  function hasRole(role: UserRole): boolean {
    return _userRole.value === role;
  }

  // Check if user has any of the specified roles
  function hasAnyRole(roles: UserRole[]): boolean {
    return _userRole.value ? roles.includes(_userRole.value) : false;
  }

  function checkAdminAccess(role: UserRole): boolean {
    return role === "SystemAdmin" || role === "Admin";
  }

  // Main Actions
  function setUserRole(role: UserRole) {
    _userRole.value = role;
    localStorage.setItem("user_role", role);
  }

  function clearUserRole() {
    _userRole.value = null;
    localStorage.removeItem("user_role");
  }

  return {
    userRole: computed(() => _userRole.value),

    isSystemAdmin,
    isAdmin,
    isUser,
    isGuest,
    hasAdminAccess,

    hasRole,
    hasAnyRole,
    checkAdminAccess,

    setUserRole,
    clearUserRole,
  };
});
