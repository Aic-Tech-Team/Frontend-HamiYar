<script setup lang="ts">
import { ref } from "vue";
import { useForm, Field as VeeField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { toast } from "vue-sonner";
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { appConfig } from "@/config";
import { useContactApi } from "@/composables/api/useContactApi";

import IconPhTelegramLogoLight from "~icons/ph/telegram-logo-light";
import IconSolarLetterOutline from "~icons/solar/letter-outline";
import IconSolarMapPointOutline from "~icons/solar/map-point-outline";
import IconIcBaselineTelegram from "~icons/ic/baseline-telegram";
import IconMageLinkedin from "~icons/mage/linkedin";
import IconRiInstagramFill from "~icons/ri/instagram-fill";
import IconSolarRefreshCircleOutline from "~icons/solar/refresh-circle-outline";
import IconSolarPlain2Outline from "~icons/solar/plain-2-outline";

// Validation Schema
const supportSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .max(11, "شماره تماس نمی‌تواند بیشتر از ۱۱ رقم باشد")
    .regex(/^0?9\d{9}$/, "شماره تماس معتبر نیست"),
  email: z.union([z.string().email("ایمیل معتبر نیست"), z.literal("")]).optional(),
  subject: z
    .string()
    .min(3, "موضوع باید حداقل ۳ کاراکتر باشد")
    .max(100, "موضوع نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),
  description: z
    .string()
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .max(1000, "توضیحات نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد"),
});

type SupportFormValues = z.infer<typeof supportSchema>;

const isSubmitting = ref(false);
const { submitContact } = useContactApi();

// Form Handling
const { handleSubmit, resetForm } = useForm<SupportFormValues>({
  validationSchema: toTypedSchema(supportSchema),
  initialValues: {
    phone: "",
    email: "",
    subject: "",
    description: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    await submitContact({
      phone: values.phone,
      email: values.email || undefined,
      subject: values.subject,
      message: values.description,
    });

    toast.success("پیام شما با موفقیت ارسال شد.", {
      description: "کارشناسان ما به زودی با شما ارتباط خواهند گرفت.",
      richColors: true,
    });

    resetForm();
  } catch (error: any) {
    console.error("Error submitting support form:", error);

    // Use the pre-extracted message from our interceptor
    const errorMessage = error.extractedMessage || "خطا در ارتباط با سرور";

    toast.error("خطا در ارسال", {
      description: errorMessage,
      richColors: true,
    });
  } finally {
    isSubmitting.value = false;
  }
});

// Contact info data
const contactInfo = [
  {
    icon: IconPhTelegramLogoLight,
    title: "تلگرام پشتیبانی",
    value: appConfig.aic.contact.telegram.username,
    action: appConfig.aic.contact.telegram.url,
  },
  {
    icon: IconSolarLetterOutline,
    title: "ایمیل پشتیبانی",
    value: appConfig.aic.contact.email.address,
    action: appConfig.aic.contact.email.mailto,
  },
  {
    icon: IconSolarMapPointOutline,
    title: "آدرس دفتر",
    value: appConfig.aic.contact.address.text,
    action: appConfig.aic.contact.address.url,
  },
];
</script>

<template>
  <section
    id="support"
    class="flex flex-col justify-center items-center container-padding scroll-mt-20 sm:scroll-mt-24"
  >
    <section class="w-full max-w-max mb-8 sm:mb-10 flex-col-center gap-4 text-center">
      <h2 class="text-2xl xs:text-3xl font-bold text-foreground">پشتیبانی</h2>
      <hr class="w-3/5 max-w-xs h-1 bg-brand-primary-500 border-none rounded-full" />
    </section>

    <Card class="w-full max-w-6xl rounded-2xl sm:rounded-3xl overflow-hidden border-none gap-0 p-0">
      <div class="grid grid-cols-1 lg:grid-cols-5">
        <!-- Right Side: Contact Information (Dark/Primary Panel) -->
        <section
          class="lg:col-span-2 bg-brand-primary-500 text-primary-foreground p-6 xs:p-8 md:p-12 flex flex-col justify-between relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl lg:rounded-s-3xl lg:rounded-e-none"
        >
          <!-- Content -->
          <div class="relative z-10 space-y-6">
            <h2 class="text-2xl xs:text-3xl font-bold tracking-tight">تماس با ما</h2>
            <p class="text-primary-foreground/80 leading-relaxed">
              برای امور پشتیبانی یا طرح سوالات خود، می‌توانید از راه‌های ارتباطی زیر یا فرم مقابل
              استفاده کنید.
            </p>
          </div>

          <div class="relative z-10 space-y-8 mt-10">
            <div v-for="(item, index) in contactInfo" :key="index" class="flex items-start gap-4">
              <div class="p-3 bg-white/15 rounded-xl backdrop-blur-sm shrink-0">
                <component :is="item.icon" class="text-2xl text-white" />
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-sm font-medium text-white/70">{{ item.title }}</span>
                <a
                  :href="item.action"
                  class="font-bold hover:text-white/80 transition-colors dir-ltr text-right"
                >
                  {{ item.value }}
                </a>
              </div>
            </div>
          </div>

          <!-- Social Media Links -->
          <div class="relative z-10 flex gap-4 mt-10">
            <!-- Telegram -->
            <a
              :href="appConfig.aic.social.telegram.url"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 bg-white/15 rounded-full hover:bg-white/20 transition-all"
            >
              <IconIcBaselineTelegram class="text-2xl" />
            </a>
            <!-- LinkedIn -->
            <a
              :href="appConfig.aic.social.linkedin.url"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 bg-white/15 rounded-full hover:bg-white/20 transition-all"
            >
              <IconMageLinkedin class="text-2xl" />
            </a>
            <!-- Instagram -->
            <a
              :href="appConfig.aic.social.instagram.url"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 bg-white/15 rounded-full hover:bg-white/20 transition-all"
            >
              <IconRiInstagramFill class="text-2xl" />
            </a>
          </div>
        </section>

        <!-- Left Side: Form -->
        <section
          class="lg:col-span-3 p-6 xs:p-8 md:p-12 border-2 rounded-b-2xl sm:rounded-b-3xl lg:rounded-e-3xl lg:rounded-s-none lg:border-s-0 flex flex-col min-w-0"
        >
          <div class="mb-8 xs:mb-10">
            <h3 class="text-xl xs:text-2xl font-bold text-foreground mb-2">ارسال پیام</h3>
            <p class="text-muted-foreground">
              فرم زیر را پر کنید، ما در سریع‌ترین زمان پاسخ خواهیم داد.
            </p>
          </div>

          <form @submit.prevent="onSubmit" class="flex flex-col flex-1 gap-6">
            <!-- Phone & Email Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field class="gap-1.5">
                <FieldLabel class="text-foreground/80" required>شماره موبایل</FieldLabel>
                <FieldContent>
                  <VeeField name="phone" v-slot="{ field, errors }">
                    <Input
                      v-bind="field"
                      type="tel"
                      placeholder="09xxxxxxxxx"
                      required
                      dir="ltr"
                      maxlength="11"
                      :class="[
                        'placeholder:text-left',
                        { 'border-destructive ring-destructive/20': errors.length > 0 },
                      ]"
                    />
                    <FieldError v-if="errors.length > 0">{{ errors[0] }}</FieldError>
                  </VeeField>
                </FieldContent>
              </Field>

              <Field class="gap-1.5">
                <FieldLabel class="text-foreground/80">ایمیل</FieldLabel>
                <FieldContent>
                  <VeeField name="email" v-slot="{ field, errors }">
                    <Input
                      v-bind="field"
                      type="email"
                      placeholder="name@example.com"
                      :class="[
                        'placeholder:text-left',
                        { 'border-destructive ring-destructive/20': errors.length > 0 },
                      ]"
                    />
                    <FieldError v-if="errors.length > 0">{{ errors[0] }}</FieldError>
                  </VeeField>
                </FieldContent>
              </Field>
            </div>

            <!-- Subject -->
            <Field class="gap-1.5">
              <FieldLabel class="text-foreground/80" required>موضوع پیام</FieldLabel>
              <FieldContent>
                <VeeField name="subject" v-slot="{ field, errors }">
                  <Input
                    v-bind="field"
                    placeholder="موضوع پیام خود را بنویسید..."
                    required
                    :class="{ 'border-destructive ring-destructive/20': errors.length > 0 }"
                  />
                  <FieldError v-if="errors.length > 0">{{ errors[0] }}</FieldError>
                </VeeField>
              </FieldContent>
            </Field>

            <!-- Message Area -->
            <Field class="gap-1.5">
              <FieldLabel class="text-foreground/80" required>متن پیام</FieldLabel>
              <FieldContent>
                <VeeField name="description" v-slot="{ field, errors }">
                  <Textarea
                    v-bind="field"
                    placeholder="توضیحات خود را بنویسید..."
                    required
                    :rows="5"
                    :class="{ 'border-destructive ring-destructive/20': errors.length > 0 }"
                  />
                  <FieldError v-if="errors.length > 0">{{ errors[0] }}</FieldError>
                </VeeField>
              </FieldContent>
            </Field>

            <!-- Action -->
            <div class="flex justify-end pt-4 mt-auto">
              <Button type="submit" size="xl" :disabled="isSubmitting">
                <span>ارسال پیام</span>
                <IconSolarRefreshCircleOutline v-if="isSubmitting" class="text-xl animate-spin" />
                <IconSolarPlain2Outline v-else class="text-xl" />
              </Button>
            </div>
          </form>
        </section>
      </div>
    </Card>
  </section>
</template>

<style scoped>
/* Optional: Smooth scroll behavior if needed */
section {
  scroll-behavior: smooth;
}
</style>
