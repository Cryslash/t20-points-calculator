import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "src/module.ts",
      output: {
        entryFileNames: "module.js",
        format: "iife", // Foundry usa script direto no browser
        name: "T20PointsCalculator"
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
