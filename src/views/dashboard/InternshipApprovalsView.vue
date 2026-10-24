<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInternshipApi } from "@/composables/api/useInternshipApi";
import type {
  InternshipManagerListItem,
  InternshipManagerDetail,
  InternshipStatus,
} from "@/types/requests/internship";

const { listManagerInternships, getManagerInternship, approveManagerInternship } = useInternshipApi();
const items = ref<InternshipManagerListItem[]>([]);
const detail = ref<InternshipManagerDetail | null>(null);
const statusFilter = ref<"all" | InternshipStatus>("all");
const query = ref("");
const loading = ref(false);
const detailLoading = ref(false);
const approving = ref(false);
const confirmApproved = ref(false);
const errorMessage = ref("");

const filtered = computed(() => {
  const text = query.value.trim().toLocaleLowerCase();
  return items.value.filter((row) =>
    (!text || [row.student_name, row.student_number, row.tracking_number,
      row.company_name, row.internship_title].some((field) =>
      String(field || "").toLocaleLowerCase().includes(text),
    )),
  );
});

const statusLabels: Record<InternshipStatus, string> = {
  pending: "در انتظار تایید",
  issued: "تایید شده",
  invalid: "باطل شده",
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("fa-IR");
}

function errorText(error: unknown) {
  const apiError = error as { response?: { status?: number }; extractedMessage?: string };
  if (apiError.response?.status === 403) return "شما مجوز مشاهده یا تایید درخواست‌ها را ندارید";
  return apiError.extractedMessage || "دریافت اطلاعات از سرور انجام نشد";
}

async function loadList() {
  loading.value = true;
  errorMessage.value = "";
  try {
    items.value = await listManagerInternships(statusFilter.value);
  } catch (error) {
    errorMessage.value = errorText(error);
    items.value = [];
  } finally {
    loading.value = false;
  }
}

async function openDetail(id: number) {
  detailLoading.value = true;
  detail.value = null;
  confirmApproved.value = false;
  try {
    detail.value = await getManagerInternship(id);
  } catch (error) {
    toast.error(errorText(error));
  } finally {
    detailLoading.value = false;
  }
}

async function approve() {
  if (!detail.value || detail.value.status !== "pending" || !confirmApproved.value || approving.value) return;
  approving.value = true;
  try {
    const response = await approveManagerInternship(detail.value.id);
    if (response.status !== "issued") throw new Error("Approval did not issue the internship");
    toast.success(response.already_approved ? "این کارآموزی قبلا تایید شده است" : "کارآموزی تایید شد و QR Code صادر شد");
    await Promise.all([loadList(), openDetail(response.id)]);
  } catch (error) {
    toast.error("تایید کارآموزی انجام نشد", { description: errorText(error) });
  } finally {
    approving.value = false;
  }
}

onMounted(loadList);
</script>

<template>
  <main dir="rtl" class="space-y-6 pb-12">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-brand-primary-900">مدیریت تایید کارآموزی‌ها</h1>
        <p class="mt-2 text-sm text-muted-foreground">فقط درخواست‌های بررسی شده را تایید کنید؛ QR Code پس از تایید ساخته می‌شود.</p>
      </div>
      <Button variant="outline" :disabled="loading" @click="loadList">{{ loading ? 'در حال بارگذاری...' : 'به‌روزرسانی لیست' }}</Button>
    </header>

    <section class="rounded-2xl border border-brand-primary-200 bg-white p-5">
      <div class="flex flex-col gap-3 sm:flex-row">
        <label class="flex flex-col gap-2 text-sm font-semibold">
          وضعیت درخواست
          <select v-model="statusFilter" class="h-10 rounded-lg border border-input bg-white px-3" @change="detail = null; loadList()">
            <option value="pending">در انتظار تایید</option>
            <option value="issued">تایید شده</option>
            <option value="invalid">باطل شده</option>
            <option value="all">همه درخواست‌ها</option>
          </select>
        </label>
        <label class="flex flex-1 flex-col gap-2 text-sm font-semibold">
          جستجو در لیست
          <Input v-model="query" placeholder="نام دانشجو، شماره دانشجویی، شرکت یا کد پیگیری" class="h-10" />
        </label>
      </div>
      <p v-if="errorMessage" role="alert" class="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</p>
      <p v-else-if="loading" class="mt-5 text-sm text-muted-foreground">در حال دریافت درخواست‌ها...</p>
      <p v-else-if="!filtered.length" class="mt-5 text-sm text-muted-foreground">درخواستی با این فیلتر پیدا نشد</p>
      <div v-else class="mt-5 overflow-x-auto">
        <table class="w-full min-w-[760px] border-collapse text-right text-sm">
          <thead class="border-b bg-brand-primary-50 text-brand-primary-900">
            <tr>
              <th class="p-3">دانشجو</th><th class="p-3">شماره دانشجویی</th><th class="p-3">شرکت</th>
              <th class="p-3">کد پیگیری</th><th class="p-3">تاریخ ثبت</th><th class="p-3">وضعیت</th><th class="p-3">بررسی</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filtered" :key="row.id" class="border-b border-brand-primary-100 hover:bg-brand-primary-50/40">
              <td class="p-3 font-medium">{{ row.student_name }}</td>
              <td class="p-3" dir="ltr">{{ row.student_number }}</td>
              <td class="p-3">{{ row.company_name }}</td>
              <td class="p-3" dir="ltr">{{ row.tracking_number }}</td>
              <td class="p-3">{{ formatDate(row.created_at) }}</td>
              <td class="p-3">{{ statusLabels[row.status] || row.status }}</td>
              <td class="p-3"><Button size="sm" variant="outline" :disabled="detailLoading" @click="openDetail(row.id)">جزئیات</Button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-if="detailLoading" class="rounded-2xl border bg-white p-5 text-sm">در حال دریافت جزئیات...</section>
    <section v-else-if="detail" class="rounded-2xl border border-brand-primary-200 bg-white p-5" aria-label="جزئیات کارآموزی">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-brand-primary-900">جزئیات درخواست {{ detail.tracking_number }}</h2>
          <p class="mt-1 text-sm text-muted-foreground">وضعیت: {{ statusLabels[detail.status] || detail.status }}</p>
        </div>
        <Button variant="ghost" @click="detail = null">بستن</Button>
      </div>
      <dl class="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div><dt class="text-muted-foreground">نام دانشجو</dt><dd class="mt-1 font-semibold">{{ detail.student_detail?.first_name }} {{ detail.student_detail?.last_name }}</dd></div>
        <div><dt class="text-muted-foreground">شماره دانشجویی</dt><dd class="mt-1 font-semibold" dir="ltr">{{ detail.student_detail?.student_number }}</dd></div>
        <div><dt class="text-muted-foreground">شرکت / سازمان</dt><dd class="mt-1 font-semibold">{{ detail.company_name }}</dd></div>
        <div><dt class="text-muted-foreground">واحد / دپارتمان</dt><dd class="mt-1 font-semibold">{{ detail.department }}</dd></div>
        <div><dt class="text-muted-foreground">عنوان دوره</dt><dd class="mt-1 font-semibold">{{ detail.internship_title }}</dd></div>
        <div><dt class="text-muted-foreground">مدت دوره</dt><dd class="mt-1 font-semibold">{{ detail.duration_hours }} ساعت</dd></div>
        <div><dt class="text-muted-foreground">استاد</dt><dd class="mt-1 font-semibold">{{ detail.internship_instructor }}</dd></div>
        <div><dt class="text-muted-foreground">کد پستی</dt><dd class="mt-1 font-semibold">{{ detail.postal_code }}</dd></div>
        <div><dt class="text-muted-foreground">مورد انضباطی</dt><dd class="mt-1 font-semibold">{{ detail.has_disciplinary_issue ? 'دارد' : 'ندارد' }}</dd></div>
        <div class="sm:col-span-2"><dt class="text-muted-foreground">آدرس کارآموزی</dt><dd class="mt-1 font-semibold whitespace-pre-wrap">{{ detail.workplace_address }}</dd></div>
        <div><dt class="text-muted-foreground">تاریخ تایید</dt><dd class="mt-1 font-semibold">{{ formatDate(detail.approved_at) }}</dd></div>
      </dl>
      <div v-if="detail.status === 'pending'" class="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <label class="flex cursor-pointer items-center gap-3 text-sm font-semibold">
          <input v-model="confirmApproved" type="checkbox" class="size-5 accent-brand-primary-700" />
          اطلاعات این کارآموزی را بررسی کردم و تایید می‌کنم
        </label>
        <Button class="mt-4" :disabled="!confirmApproved || approving" @click="approve">
          {{ approving ? 'در حال تایید...' : 'تایید نهایی و صدور QR Code' }}
        </Button>
      </div>
      <div v-else-if="detail.status === 'issued'" class="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
        <p class="font-bold text-emerald-800">این درخواست تایید شده است</p>
        <a v-if="detail.qr_url" :href="detail.qr_url" target="_blank" rel="noopener noreferrer" class="mt-2 inline-block underline">مشاهده لینک QR</a>
        <img v-if="detail.qr_code_image" :src="detail.qr_code_image" alt="QR Code تایید کارآموزی" class="mt-3 size-36 rounded-lg border bg-white p-2" />
      </div>
    </section>
  </main>
</template>
