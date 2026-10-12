import { defineConfig, devices } from "@playwright/test"
import { E2E_PASSWORD, E2E_PORT } from "./e2e/constants"

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: `http://localhost:${E2E_PORT}` },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // A production build, so the proxy and the gate behave as they do on Vercel.
  webServer: {
    command: `npm run build && npm run start -- -p ${E2E_PORT}`,
    port: E2E_PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
    env: { SITE_PASSWORD: E2E_PASSWORD },
  },
})
