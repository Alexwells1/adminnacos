import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "meta/favicon-16x16.png",
        "meta/favicon-32x32.png",
        "meta/apple-touch-icon.png"
      ],
      manifest: {
        id: "/admin",
        name: "NACOS - ADMIN Dashboard",
        short_name: "NACOS Admin",
        description:
          "Official NACOS FUNAAB Admin Dashboard for managing dues, payments, executives, and statistics.",
        start_url: "/admin/dashboard",
        scope: "/admin/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#1f2937",
        theme_color: "#1f2937",
        categories: ["productivity", "education", "management"],
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/maskable_icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        shortcuts: [
          {
            name: "Dashboard",
            short_name: "Dashboard",
            description: "Go to Admin Dashboard",
            url: "/admin/dashboard",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }]
          },
          {
            name: "Payments",
            short_name: "Payments",
            description: "View and manage student payments",
            url: "/admin/payments",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }]
          },
          {
            name: "Executives",
            short_name: "Executives",
            description: "Manage executive profiles",
            url: "/admin/executives",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }]
          },
          {
            name: "Census Stats",
            short_name: "Census",
            description: "View census statistics",
            url: "/census-stats",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }]
          }
        ],
        lang: "en",
        dir: "ltr"
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }: { request: Request }) =>
              request.destination === "document" ||
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image" ||
              request.destination === "font",
            handler: "CacheFirst",
            options: {
              cacheName: "nacos-admin-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
