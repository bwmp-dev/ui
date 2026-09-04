import { defineConfig, devices } from '@playwright/test'

const PORT = 4319
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Runs against the production build: the dev server's overlay and HMR make
  // failures harder to read, and this is closer to what ships.
  webServer: {
    command: `pnpm build && pnpm preview --port ${PORT} --strictPort`,
    // The suite owns this production build, so give it an explicit mock-only
    // environment instead of relying on a developer's untracked `.env` file.
    // Regular production builds still require their deployment configuration.
    env: {
      VITE_API_URL: 'http://api.invalid',
      VITE_API_MOCK: 'true',
      VITE_APP_NAME: 'Stack App E2E',
    },
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
