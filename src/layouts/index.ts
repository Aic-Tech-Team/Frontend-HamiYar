import type { Component } from "vue";
import DefaultLayout from "./DefaultLayout.vue";
import BlankLayout from "./BlankLayout.vue";
import DashboardLayout from "./DashboardLayout.vue";
import FormLayout from "./FormLayout.vue";

/**
 * Layout keys — must match entries in `layouts` registry
 */
export type LayoutType = "default" | "blank" | "dashboard" | "form";

export const layouts: Record<LayoutType, Component> = {
  default: DefaultLayout,
  blank: BlankLayout,
  dashboard: DashboardLayout,
  form: FormLayout,
};

export { DefaultLayout, BlankLayout, DashboardLayout, FormLayout };

export function resolveLayout(name?: LayoutType): Component {
  return layouts[name ?? "default"] ?? DefaultLayout;
}
