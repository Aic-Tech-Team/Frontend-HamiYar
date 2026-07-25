/**
 * Router and route-related types
 */

import "vue-router";
import type { LayoutType } from "@/layouts";

/**
 * Extended route meta interface with type safety
 */
declare module "vue-router" {
  interface RouteMeta {
    /**
     * Page title for document title
     */
    title?: string;

    /**
     * Layout type to use for this route (falls back to `default`)
     * - 'default': Standard page shell
     * - 'blank': Minimal shell (login, errors)
     * - 'dashboard': Sidebar shell for admin/dashboard routes
     * - 'form': A4 document shell (education / internship forms)
     */
    layout?: LayoutType;

    /**
     * Require authentication (defaults to `true` — secure by default)
     */
    requiresAuth?: boolean;

    /**
     * If user is already authenticated, redirect to Dashboard
     * (e.g. login page)
     */
    redirectIfAuthenticated?: boolean;

    /**
     * Public print/document view (no edit chrome)
     */
    print?: boolean;

    /**
     * Use fixed viewport width (1024px) on mobile to zoom out
     * and show desktop layout instead of responsive shrink
     */
    fixedViewport?: boolean;
  }
}
