import type { Component } from "vue";

import IconSolarDiplomaVerifiedOutline from "~icons/solar/diploma-verified-outline";
import IconSolarCaseOutline from "~icons/solar/case-outline";
import IconSolarClipboardListOutline from "~icons/solar/clipboard-list-outline";
import IconSolarLetterOutline from "~icons/solar/letter-outline";
import IconSolarSquareAcademicCapOutline from "~icons/solar/square-academic-cap-outline";
import IconSolarDocumentTextOutline from "~icons/solar/document-text-outline";
import IconSolarCodeSquareOutline from "~icons/solar/code-square-outline";
import IconSolarDocumentsOutline from "~icons/solar/documents-outline";
import IconSolarMedalRibbonsStarOutline from "~icons/solar/medal-ribbons-star-outline";

export interface ServiceItem {
  id: string;
  icon: Component;
  title: string;
  description: string;
  isActive: boolean;
  isSupported: boolean;
}

export const services: ServiceItem[] = [
  {
    id: "education",
    icon: IconSolarDiplomaVerifiedOutline,
    title: "گواهی اشتغال به تحصیل",
    description: "دریافت سریع گواهی اشتغال به تحصیل جهت ارائه به سازمان‌ها و نهادهای مختلف.",
    isActive: true,
    isSupported: true,
  },
  {
    id: "etela",
    icon: IconSolarMedalRibbonsStarOutline, //
    title: "گواهی طرح اعتلا",
    description: "صدور گواهی گذراندن دوره ۸ ساعته طرح ملی اعتلا، ویژه دستیاران آموزشی.",
    isActive: true, // frontend built, backend not ready — flip once it is
    isSupported: true,
  },
  {
    id: "internship",
    icon: IconSolarCaseOutline,
    title: "نامه کارآموزی",
    description: "هماهنگی و دریافت معرفی‌نامه جهت گذراندن دوره‌های کارآموزی در صنایع کشور.",
    isActive: false,
    isSupported: true,
  },
  {
    id: "transcript",
    icon: IconSolarClipboardListOutline,
    title: "ریز نمرات تحصیلی",
    description: "مشاهده و دریافت ریز نمرات رسمی تأیید شده جهت ترجمه یا ارائه به مراکز آموزشی.",
    isActive: false,
    isSupported: false,
  },
  {
    id: "introduction-letter",
    icon: IconSolarLetterOutline,
    title: "معرفی‌نامه به سازمان‌ها",
    description: "صدور انواع معرفی‌نامه برای دانش‌آموختگان جهت تسهیل در فرآیند استخدامی.",
    isActive: false,
    isSupported: false,
  },
  {
    id: "temporary-graduation",
    icon: IconSolarSquareAcademicCapOutline,
    title: "گواهی فارغ‌التحصیلی موقت",
    description: "درخواست صدور گواهی موقت پس از اتمام تمامی واحدهای درسی مقطع مربوطه.",
    isActive: false,
    isSupported: false,
  },
  {
    id: "course-completion-certificate",
    icon: IconSolarDocumentTextOutline,
    title: "گواهی پایان دوره آموزشی",
    description:
      "صدور گواهی رسمی پایان دوره آموزشی برای ارائه به سازمان‌ها، مراکز آموزشی و محل کار.",
    isActive: false,
    isSupported: false,
  },
  {
    id: "creative-code-certificate",
    icon: IconSolarCodeSquareOutline,
    title: "گواهی کد خلاق",
    description: "دریافت گواهی کد خلاق جهت تأیید فعالیت‌های آموزشی، پژوهشی و پروژه‌های ثبت‌شده.",
    isActive: false,
    isSupported: false,
  },
  {
    id: "custom-documents",
    icon: IconSolarDocumentsOutline,
    title: "انواع اسناد سفارشی",
    description:
      "ثبت درخواست و صدور انواع اسناد و گواهی‌های سفارشی متناسب با نیاز دانشجویان و سازمان‌ها.",
    isActive: false,
    isSupported: false,
  },
];
