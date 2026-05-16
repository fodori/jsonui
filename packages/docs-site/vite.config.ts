/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * GitHub Pages: project sites live at https://<user>.github.io/<repo>/ — Vite `base` must match.
 * - Local / custom: default `/` (override with VITE_BASE_PATH, e.g. `/jsonui/`).
 * - GitHub Actions: set from GITHUB_REPOSITORY when VITE_BASE_PATH is unset (skip for `<user>.github.io` repos).
 */
function githubPagesBase(): string {
  const manual = process.env.VITE_BASE_PATH
  if (manual != null && manual !== '') {
    return manual.endsWith('/') ? manual : `${manual}/`
  }
  const ref = process.env.GITHUB_REPOSITORY
  if (!ref) return '/'
  const [owner, repo] = ref.split('/')
  if (!owner || !repo) return '/'
  if (repo === `${owner}.github.io`) return '/'
  return `/${repo}/`
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: githubPagesBase(),
  resolve: {
    alias: {
      src: path.resolve(dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  assetsInclude: ['**/*.md'],
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./src/setupTests.ts'],
  },
})
