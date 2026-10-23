import { useDateFormatter } from "reka-ui";
import { toDate } from "reka-ui/date";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";

export const useDate = () => {
  const formatter = useDateFormatter("fa");

  const getToday = () => {
    return formatter.custom(toDate(today(getLocalTimeZone()), getLocalTimeZone()), {
      numberingSystem: "latn",
    });
  };

  const formatIsoToJalali = (date: string | null | undefined) => {
    if (!date) return "-";
    try {
      const parsed = parseDate(date);
      return formatter.custom(toDate(parsed, getLocalTimeZone()), { numberingSystem: "latn" });
    } catch {
      return "-";
    }
  };

  const formatDateString = (date: string | null | undefined) => {
    if (!date) return null;
    try {
      const parsed = parseDate(date);
      return formatter.custom(toDate(parsed, getLocalTimeZone()), { numberingSystem: "latn" });
    } catch {
      return date;
    }
  };

  return {
    getToday,
    formatIsoToJalali,
    formatDateString,
  };
};
