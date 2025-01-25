import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  base: "/plugin.res-cache",
  root: "./src",
  build: {
    outDir: "../public",
  },
  plugins: [vue()],
  server: {
    host: "127.0.0.1",
    proxy: {
      "/plugin.res-cache/cgi-bin": {
        target: "http://127.0.0.1:8899",
        changeOrigin: true,
      }
    }
  },
  html: {
    
  }
});
