import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    alias: {
      "@types": path.resolve(__dirname, "../../shared/types/src"),
    },
  },
});
