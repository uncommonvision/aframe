import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  // Build proxy target from environment variables with fallback
  const proxyHost = env.VITE_PROXY_HOST || 'localhost'
  const proxyPort = env.VITE_PROXY_PORT || '8080'
  const proxyTarget = `http://${proxyHost}:${proxyPort}`

  // Validate required environment variables
  if (!env.VITE_PROXY_HOST || !env.VITE_PROXY_PORT) {
    console.warn('⚠️  VITE_PROXY_HOST and VITE_PROXY_PORT should be set in your .env file for proper proxy configuration.')
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          ws: true,
        }
      }
    }
  }
})
