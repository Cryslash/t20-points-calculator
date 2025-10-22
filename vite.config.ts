import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  publicDir: "public",
  build: {
    outDir: "/mnt/c/Users/cryst/AppData/Local/FoundryVTT/Data/modules/t20calc",
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/entry.ts"),
      output: {
        entryFileNames: "module.js",
        format: "iife",
        name: "T20Calc",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
