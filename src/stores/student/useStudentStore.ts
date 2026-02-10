import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { StudentInfo } from "@/types/requests/student";

export const useStudentStore = defineStore("student", () => {
  const _student = ref<StudentInfo | null>(null);

  function setStudent(info: StudentInfo) {
    _student.value = info;
  }

  function clearStudent() {
    _student.value = null;
  }

  return {
    student: computed(() => _student.value),
    exists: computed(() => _student.value !== null),
    setStudent,
    clearStudent,
  };
});
