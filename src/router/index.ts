import { createRouter, createWebHistory } from "vue-router";
import "@/types/router";
import { appConfig } from "@/config";
import { useAuthJwtStore } from "@/stores/account/useAuthJwtStore";

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
    // Errors — /error, /error/:code
    {
      path: "/error",
      meta: {
        requiresAuth: false,
        layout: "blank",
      },
      children: [
        {
          path: "",
          redirect: { name: "Error", params: { code: "404" } },
        },
        {
          path: ":code",
          name: "Error",
          component: () => import("@/views/errors/ErrorView.vue"),
          meta: {
            title: `خطا | ${appName}`,
          },
        },
      ],
    },

    // Public
    {
      path: "/",
      name: "Landing",
      component: () => import("@/views/LandingPageView.vue"),
      meta: {
        title: `صفحه اصلی | ${appName}`,
        requiresAuth: false,
        layout: "default",
      },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        title: `ورود | ${appName}`,
        requiresAuth: false,
        redirectIfAuthenticated: true,
        layout: "blank",
      },
    },

    // Dashboard — /dashboard/*
    {
      path: "/dashboard",
      meta: {
        requiresAuth: false,
        layout: "dashboard",
      },
      children: [
        {
          path: "",
          name: "Dashboard",
          component: () => import("@/views/dashboard/DashboardView.vue"),
          meta: {
            title: `داشبورد | ${appName}`,
          },
        },
        {
          path: "example",
          name: "DashboardExample",
          component: () => import("@/views/dashboard/ExampleView.vue"),
          meta: {
            title: `مثال | ${appName}`,
          },
        },
      ],
    },

    // Education forms — /education, /education/:trackingNumber
    {
      path: "/education",
      meta: {
        layout: "form",
        fixedViewport: true,
      },
      children: [
        {
          path: "",
          name: "Education",
          component: () => import("@/views/forms/EducationFormView.vue"),
          meta: {
            title: `گواهی اشتغال به تحصیل | ${appName}`,
            requiresAuth: true,
          },
        },
        {
          path: ":trackingNumber",
          name: "EducationPublic",
          component: () => import("@/views/forms/EducationFormView.vue"),
          meta: {
            title: `گواهی اشتغال به تحصیل | ${appName}`,
            requiresAuth: false,
            print: true,
          },
        },
      ],
    },

    // Internship forms — /internship, /internship/:trackingNumber
    {
      path: "/internship",
      meta: {
        layout: "form",
        fixedViewport: true,
      },
      children: [
        {
          path: "",
          name: "Internship",
          component: () => import("@/views/forms/InternshipFormView.vue"),
          meta: {
            title: `نامه کارآموزی | ${appName}`,
            requiresAuth: true,
          },
        },
        {
          path: ":trackingNumber",
          name: "InternshipPublic",
          component: () => import("@/views/forms/InternshipFormView.vue"),
          meta: {
            title: `نامه کارآموزی | ${appName}`,
            requiresAuth: false,
            print: true,
          },
        },
      ],
    },

    // Catch-all → 404 (must be last; public so guests aren't sent to login)
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: "Error", params: { code: "404" } },
      meta: {
        requiresAuth: false,
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthJwtStore();
  const isAuthenticated = authStore.isAuthenticated;
  const requiresAuth = to.meta.requiresAuth ?? true;

  if (to.meta.fixedViewport) {
    setViewport(VIEWPORT_FIXED);
  } else if (from?.meta?.fixedViewport) {
    setViewport(VIEWPORT_DEFAULT);
  }

  if (to.meta.title) {
    document.title = to.meta.title;
  }

  if (requiresAuth && !isAuthenticated) {
    next({ name: "Login", query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.redirectIfAuthenticated && isAuthenticated) {
    next({ name: "Dashboard" });
    return;
  }

  next();
});

export default router;
