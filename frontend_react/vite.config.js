import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "node:path";

// https://vitejs.dev/config/

export default defineConfig({
  build: { manifest: true },
  // eslint-disable-next-line no-undef
  base: process.env.mode === "production" ? "/static/" : "/",
  root: "./src",
  plugins: [react()],
  server: {
    port: 8001,
  },
  resolve: {
    alias: {
      /* eslint-disable */
      _: path.resolve(__dirname, "./src"),
      _components: path.resolve(__dirname, "./src/components"),
      _atoms: path.resolve(__dirname, "./src/components/atoms"),
      _molecules: path.resolve(__dirname, "./src/components/molecules"),
      _organisms: path.resolve(__dirname, "./src/components/organisms"),
      _templates: path.resolve(__dirname, "./src/components/templates"),
      _contexts: path.resolve(__dirname, "./src/contexts"),
      _hooks: path.resolve(__dirname, "./src/hooks"),
      _pages: path.resolve(__dirname, "./src/pages"),
      _services: path.resolve(__dirname, "./src/services"),
      _store: path.resolve(__dirname, "./src/store"),
    },
  },
});
