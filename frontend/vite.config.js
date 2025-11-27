// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()],
    server: {
        proxy: {
            // 백엔드 REST API가 /api 로 시작한다고 가정
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false,
            },
            // 웹소켓도 프록시 쓰고 싶으면 (필요 없으면 삭제해도 됨)
            "/ws": {
                target: "ws://localhost:8080",
                ws: true,
                changeOrigin: true,
            },
        },
    },
});
