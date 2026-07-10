import { createRouter, createWebHistory } from "vue-router";
import "@/types/router";
import { appConfig } from "@/config";
import { useAuthJwtStore } from "@/stores/account/useAuthJwtStore";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";

const appName = appConfig.app.name;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
  routes: [
    // Error routes - dynamic content by status code
    {
      path: "/error",
      redirect: { name: "Error", params: { code: "404" } },
    },
    {
      path: "/error/:code",
      name: "Error",
      component: () => import("@/views/ErrorView.vue"),
      meta: {
        title: `خطا | ${appName}`,
        mode: "public",
        layout: "blank",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: "Error", params: { code: "404" } },
    },

    // Public routes
    {
      path: "/",
      name: "Landing",
      component: () => import("@/views/LandingPageView.vue"),
      meta: {
        title: `صفحه اصلی | ${appName}`,
        mode: "public",
      },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: {
        title: `ورود | ${appName}`,
        mode: "public",
        layout: "blank",
        guestOnly: true,
      },
    },

    // Authenticated routes
    {
      path: "/home",
      name: "Home",
      component: HomeView,
      meta: {
        title: `صفحه اصلی | ${appName}`,
        mode: "public",
      },
    },

    // Education form routes
    {
      path: "/education",
      name: "Education",
      component: () => import("@/views/EducationFormView.vue"),
      meta: {
        title: `گواهی اشتغال به تحصیل | ${appName}`,
        mode: "private",
        fixedViewport: true,
      },
    },
    {
      path: "/education/:trackingNumber",
      name: "EducationPublic",
      component: () => import("@/views/EducationFormView.vue"),
      meta: {
        title: `گواهی اشتغال به تحصیل | ${appName}`,
        mode: "public",
        layout: "blank",
        fixedViewport: true,
      },
    },

    // Internship form routes
    {
      path: "/internship",
      name: "Internship",
      component: () => import("@/views/InternshipFormView.vue"),
      meta: {
        title: `نامه کارآموزی | ${appName}`,
        mode: "private",
        fixedViewport: true,
      },
    },
    {
      path: "/internship/:trackingNumber",
      name: "InternshipPublic",
      component: () => import("@/views/InternshipFormView.vue"),
      meta: {
        title: `نامه کارآموزی | ${appName}`,
        mode: "public",
        layout: "blank",
        fixedViewport: true,
      },
    },
  ],
});

const VIEWPORT_DEFAULT = "width=device-width, initial-scale=1.0";
const VIEWPORT_FIXED = "width=1024";

function setViewport(content: string) {
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) meta.setAttribute("content", content);
}

// Global Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthJwtStore();
  const isAuthenticated = authStore.isAuthenticated;

  // Set viewport: fixed width for form pages (zoom out on mobile)
  if (to.meta.fixedViewport) {
    setViewport(VIEWPORT_FIXED);
  } else if (from?.meta?.fixedViewport) {
    setViewport(VIEWPORT_DEFAULT);
  }

  // Set document title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  // Handle public routes
  if (to.meta.mode === "public") {
    // Guest-only routes: redirect authenticated users
    if (to.meta.guestOnly && isAuthenticated) {
      next({ name: "Home" });
      return;
    }
    // Public routes are accessible to everyone
    next();
    return;
  }

  // Handle private routes (default if mode is not specified)
  if (to.meta.mode === "private" || !to.meta.mode) {
    if (!isAuthenticated) {
      next({ name: "Login", query: { redirect: to.fullPath } });
      return;
    }
  }

  next();
});

export default router;
