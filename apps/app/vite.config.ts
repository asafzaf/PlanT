import { defineConfig } from "vite";
// @ts-expect-error: module resolution for this plugin may require updating tsconfig.moduleResolution to 'node16'|'nodenext'|'bundler'
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tsconfigPaths(),
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
      "@types": path.resolve(__dirname, "../../shared/types"),
    },
  },
});
