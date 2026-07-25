<script setup lang="ts">
export interface FormDocumentSignature {
  title: string;
  name: string;
  imageUrl: string;
}

defineProps<{
  signature: FormDocumentSignature;
}>();
</script>

<template>
  <footer class="w-full flex justify-end my-12">
    <div class="text-center">
      <p class="font-medium mb-2 text-sm">
        {{ signature.title }}
      </p>
      <p class="font-bold mb-4">
        {{ signature.name }}
      </p>

      <div class="relative">
        <p
          class="text-neutral-400 text-xs border-t border-dashed border-neutral-300 pt-2 w-40 mx-auto"
        >
          (محل امضا و مهر)
        </p>

        <img
          v-if="signature.imageUrl"
          :src="signature.imageUrl"
          alt="digital signature"
          width="150"
          class="absolute -top-3 right-1/2 translate-x-1/2 print:grayscale"
        />
      </div>
    </div>
  </footer>
</template>
