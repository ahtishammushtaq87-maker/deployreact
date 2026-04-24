import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    {
      name: 'apk-mime',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const requrl = req.url.split('?')[0];
          if (requrl.endsWith('.apk')) {
            res.setHeader('Content-Type', 'application/vnd.android.package-archive');
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 5174,
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true
  }
});
