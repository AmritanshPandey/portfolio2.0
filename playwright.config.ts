import { defineConfig, devices } from "@playwright/test"
import { E2E_PORT } from "./e2e/constants"

export default defineConfig({
  testDir: "e2e",
  use: { baseURL: `http://localhost:${E2E_PORT}` },
  // WebKit is Safari's engine: the hero's live sheet has to hold up there too.
  projects: [
    // Chromium's new headless mode draws WebGL on the GPU, as Chrome does for
    // visitors. The default headless shell draws it on the CPU (SwiftShader),
    // which starves the hero's live sheet once several workers run at once.
    { name: "chromium", use: { ...devices["Desktop Chrome"], channel: "chromium" } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  // A production build, so pages behave as they do on Vercel.
  webServer: {
    command: `npm run build && npm run start -- -p ${E2E_PORT}`,
    port: E2E_PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
