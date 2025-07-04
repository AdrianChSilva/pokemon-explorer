/// <reference types="vitest" />
/// <reference types="vite/client" />
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/vitest.setup.ts"],
    css: true,
    testTimeout: 5000,
    reporters: ["verbose"],
    coverage: {
      reporter: ["text", "lcov"],
      exclude: [
        "vite.config.ts",
        "eslint.config.js",
        "dist/**",
        "src/components/ui/**",
        "src/types/**",
        "src/main.tsx",
        "**/*.d.ts",
        "tailwind.config.ts",
      ],
    },
  },
});
