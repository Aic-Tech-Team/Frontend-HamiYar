<script setup lang="ts">
import { Button } from "@/components/ui/button";

import IconMynauiSaveSolid from "~icons/mynaui/save-solid";
import IconGgSpinner from "~icons/gg/spinner";
import IconMdiPencil from "~icons/mdi/pencil";
import IconMdiPrinter from "~icons/mdi/printer";
import IconMdiFileDocumentCheck from "~icons/mdi/file-document-check";

interface Props {
  isSubmitted: boolean;
  isSubmitting: boolean;
  isFormValid: boolean;
  isPrintView: boolean;
  showEditButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  showEditButton: true,
});

const emit = defineEmits<{
  submit: [];
  edit: [];
  issuance: [];
}>();

function handlePrint() {
  window.print();
}
</script>

<template>
  <div class="mt-auto flex gap-3 justify-end print:hidden">
    <template v-if="!isSubmitted">
      <Button
        variant="default"
        size="lg"
        class="text-base"
        :disabled="!isFormValid || isSubmitting"
        @click="emit('submit')"
      >
        <IconMynauiSaveSolid v-if="!isSubmitting" class="size-6" />
        <IconGgSpinner v-else class="size-6 animate-spin" />
        {{ isSubmitting ? "در حال ثبت..." : "ثبت اطلاعات" }}
      </Button>
    </template>

    <template v-else>
      <!-- TODO: enable edit later -->
      <template v-if="false">
        <Button
          v-if="showEditButton"
          variant="secondary"
          size="lg"
          class="text-base border-2"
          @click="emit('edit')"
        >
          <IconMdiPencil class="size-6" />
          ویرایش
        </Button>
      </template>

      <Button
        v-if="isPrintView"
        variant="default"
        size="lg"
        class="text-base"
        @click="handlePrint"
      >
        <IconMdiPrinter class="size-6" />
        چاپ
      </Button>

      <Button v-else variant="default" size="lg" class="text-base" @click="emit('issuance')">
        <IconMdiFileDocumentCheck class="size-6" />
        تولید سند نهایی
      </Button>
    </template>
  </div>
</template>
