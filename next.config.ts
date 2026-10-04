import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Overridable so a second dev instance (e.g. preview tooling) can run
  // alongside `next dev` without fighting over the .next lock.
  experimental: {
    optimizePackageImports: [
      "@tabler/icons-react",
      "@hugeicons/react",
      "framer-motion",
      "radix-ui",
      "recharts",
    ],
  },
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // Which Vercel environment built this (production / preview / development).
  // Inlined at build time so client components can read it; <AddLater> uses
  // it to keep editorial to-do notes off the live site.
  env: {
    NEXT_PUBLIC_DEPLOY_ENV: process.env.VERCEL_ENV ?? "development",
  },
};

export default nextConfig;
