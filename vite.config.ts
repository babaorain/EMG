import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * The repo lives inside a Dropbox folder on Windows, where the sync client
 * holds a lock on `node_modules/.vite/deps` and every dependency re-optimize
 * fails with EBUSY (the browser then gets 504 Outdated Optimize Dep). Keeping
 * the dep cache outside the synced tree avoids that entirely.
 */
const cacheDir = existsSync(tmpdir()) ? join(tmpdir(), 'emg-vite-cache') : undefined

export default defineConfig({
  cacheDir,
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
