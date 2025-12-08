import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Silence known false-positive from vue-i18n bundling currentInstance
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "IMPORT_IS_UNDEFINED" &&
          warning.id?.includes("vue-i18n")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
