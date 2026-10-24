import { defineStore } from "pinia";
import { ref } from "vue";
import { useInternshipApi } from "@/composables/api/useInternshipApi";

export const useInternshipManagerAccessStore = defineStore("internshipManagerAccess", () => {
  const allowed = ref(false);
  const checkedToken = ref<string | null>(null);
  const { listManagerInternships } = useInternshipApi();

  async function check(token: string | null, force = false): Promise<boolean> {
    if (!token) {
      reset();
      return false;
    }
    if (checkedToken.value === token && !force) return allowed.value;
    try {
      await listManagerInternships("pending");
      allowed.value = true;
    } catch {
      allowed.value = false;
    }
    checkedToken.value = token;
    return allowed.value;
  }

  function reset() {
    allowed.value = false;
    checkedToken.value = null;
  }

  return { allowed, check, reset };
});
