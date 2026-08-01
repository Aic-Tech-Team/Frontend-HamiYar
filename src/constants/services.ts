import type { Component } from "vue";
 
import IconSolarDiplomaVerifiedOutline from "~icons/solar/diploma-verified-outline";
import IconSolarCaseOutline from "~icons/solar/case-outline";
import IconSolarClipboardListOutline from "~icons/solar/clipboard-list-outline";
import IconSolarHeadphonesRoundOutline from "~icons/solar/headphones-round-outline";
import IconSolarLetterOutline from "~icons/solar/letter-outline";
import IconSolarSquareAcademicCapOutline from "~icons/solar/square-academic-cap-outline";
 
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
    id: "support",
    icon: IconSolarHeadphonesRoundOutline,
    title: "مرکز پشتیبانی ۲۴/۷",
    description: "پاسخگویی به سوالات و مشکلات فنی کاربران در تمامی مراحل ثبت و پیگیری درخواست‌ها.",
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
];