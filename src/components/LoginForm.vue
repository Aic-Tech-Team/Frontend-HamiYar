<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthApi } from "@/composables/api/useAuthApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "vue-sonner";

import IconMdiEye from "~icons/mdi/eye";
import IconMdiEyeOff from "~icons/mdi/eye-off";
import IconGgSpinner from "~icons/gg/spinner";

import type { AuthRequestModal } from "@/types/account/auth";

const username = ref("");
const password = ref("");
const isSubmitting = ref(false);
const showPassword = ref(false);

const usernameError = ref("");
const passwordError = ref("");

const router = useRouter();
const route = useRoute();
const { loginAsync } = useAuthApi();

function validateUsername() {
  if (!username.value.trim()) {
    usernameError.value = "نام کاربری الزامی است";
    return false;
  }
  if (username.value.length < 3) {
    usernameError.value = "نام کاربری باید حداقل ۳ کاراکتر باشد";
    return false;
  }
  usernameError.value = "";
  return true;
}

function validatePassword() {
  if (!password.value.trim()) {
    passwordError.value = "رمز عبور الزامی است";
    return false;
  }
  if (password.value.length < 8) {
    passwordError.value = "رمز عبور باید حداقل 8 کاراکتر باشد";
    return false;
  }
  passwordError.value = "";
  return true;
}

async function handleSubmit(e: Event) {
  e.preventDefault();

  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  if (!isUsernameValid || !isPasswordValid) {
    return;
  }

  isSubmitting.value = true;

  try {
    const payload: AuthRequestModal = {
      username: username.value,
      password: password.value,
    };

    await loginAsync(payload);

    toast.success("ورود موفق", {
      description: "خوش آمدید!",
      richColors: true,
    });

    const redirectPath = (route.query.redirect as string) || "/dashboard";
    router.push(redirectPath);
  } catch (error: any) {
    console.error("Error logging in:", error);

    // Use the pre-extracted message from our interceptor
    const errorMessage = error.extractedMessage || "خطا در ارتباط با سرور";

    toast.error("خطا در ورود", {
      description: errorMessage,
      richColors: true,
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form @submit="handleSubmit">
    <FieldGroup>
      <Field>
        <FieldLabel required>نام کاربری</FieldLabel>
        <FieldContent>
          <Input
            v-model="username"
            type="text"
            placeholder="نام کاربری"
            autocomplete="username"
            :class="{ 'border-destructive ring-destructive/20': usernameError }"
            @blur="validateUsername"
            @input="usernameError = ''"
            required
          />
          <FieldError v-if="usernameError">{{ usernameError }}</FieldError>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel required>رمز عبور</FieldLabel>
        <FieldContent>
          <div class="relative">
            <Input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="رمز عبور"
              autocomplete="current-password"
              class="pe-10"
              :class="{ 'border-destructive ring-destructive/20': passwordError }"
              @blur="validatePassword"
              @input="passwordError = ''"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabindex="-1"
            >
              <IconMdiEyeOff v-if="showPassword" class="size-5" />
              <IconMdiEye v-else class="size-5" />
            </button>
          </div>
          <FieldError v-if="passwordError">{{ passwordError }}</FieldError>
        </FieldContent>
      </Field>
    </FieldGroup>

    <Button type="submit" class="w-full mt-8" :disabled="isSubmitting" :aria-busy="isSubmitting">
      {{ isSubmitting ? "در حال ورود..." : "ورود" }}
      <IconGgSpinner v-if="isSubmitting" class="size-5 ml-2 animate-spin" />
    </Button>
  </form>
</template>
