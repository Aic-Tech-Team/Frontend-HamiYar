<script setup lang="ts">
import { computed, watch, ref } from "vue";
import { Button } from "@/components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import IconGgSpinner from "~icons/gg/spinner";

type IdentifierType = "national" | "student";

interface Props {
  isSubmitting?: boolean;
}

const emit = defineEmits<{
  submit: [{ type: IdentifierType; value: string }];
}>();

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
});

const identifier = defineModel<string | number>("identifier", {
  default: "",
});

const identifierType = ref<IdentifierType>("student");

const isOpen = defineModel<boolean>("isOpen", {
  default: false,
});

// Generate unique form ID for each modal instance
const formId = `dialogForm-${Math.random().toString(36).substring(2, 9)}`;

// Clear identifier when dialog closes
watch(isOpen, (newValue) => {
  if (!newValue) identifier.value = "";
});

// Clear identifier when identifierType changed
watch(identifierType, () => {
  identifier.value = "";
});

const isSubmitDisabled = computed(() => {
  if (props.isSubmitting) return true;
  const value = identifier.value?.toString().trim() ?? "";
  return value.length === 0;
});

function onSubmit(e: Event) {
  e.preventDefault();
  if (isSubmitDisabled.value) return;
  const identifierValue = identifier.value?.toString().trim() ?? "";
  emit("submit", {
    type: identifierType.value,
    value: identifierValue,
  });
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader class="items-start">
        <DialogTitle>دریافت اطلاعات</DialogTitle>
        <DialogDescription>شناسه کاربر مد نظر را وارد کنید.</DialogDescription>
      </DialogHeader>

      <!-- TODO: Uncomment this later -->
      <!-- <RadioGroup v-model="identifierType" class="flex w-max gap-4 mt-4">
        <div class="flex items-center gap-2">
          <RadioGroupItem value="national" id="national" />
          <Label for="national">کد ملی</Label>
        </div>

        <div class="flex items-center gap-2">
          <RadioGroupItem value="student" id="student" />
          <Label for="student">شماره دانشجویی</Label>
        </div>
      </RadioGroup> -->

      <form :id="formId" @submit="onSubmit">
        <FieldGroup>
          <Field>
            <Input v-model="identifier" id="identifier" type="text" numeric
              :placeholder="identifierType === 'national' ? 'کد ملی (10 رقمی)' : 'شماره دانشجویی'"
              :maxlength="identifierType === 'national' ? '10' : ''" />
          </Field>
        </FieldGroup>
      </form>

      <DialogFooter class="flex-row-reverse">
        <Button type="submit" :form="formId" :disabled="isSubmitDisabled" :aria-busy="props.isSubmitting">
          {{ props.isSubmitting ? "درحال بررسی" : "بررسی" }}
          <IconGgSpinner v-if="props.isSubmitting" class="size-5 animate-spin" />
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
