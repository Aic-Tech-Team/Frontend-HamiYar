import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import Icons from "unplugin-icons/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",

  server: {
    port: 5173,
    strictPort: true,
  },

  plugins: [vue(), vueDevTools(), tailwindcss(), Icons({ compiler: "vue3" })],

  define: { "process.env": {} },

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
