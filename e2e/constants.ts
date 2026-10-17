// The port of the local production server the end-to-end suite starts.
// Override with E2E_PORT when another worktree's suite is already on 3100:
// Playwright would otherwise reuse that server and test the wrong code.
export const E2E_PORT = Number(process.env.E2E_PORT ?? 3100)
