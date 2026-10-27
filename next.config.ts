import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Overridable so a second dev instance (e.g. preview tooling) can run
  // alongside `next dev` without fighting over the .next lock.
  experimental: {
    // Page transitions: route changes cross-dissolve through React's
    // <ViewTransition> (see app/layout.tsx and the ::view-transition rules).
    viewTransition: true,
    optimizePackageImports: [
      "@tabler/icons-react",
      "@hugeicons/react",
      "framer-motion",
      "radix-ui",
      "recharts",
    ],
  },
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  // AVIF first: the photos come out noticeably smaller than WebP at the same
  // quality, and browsers without it still get WebP.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Which Vercel environment built this (production / preview / development).
  // Inlined at build time so client components can read it; <AddLater> uses
  // it to keep editorial to-do notes off the live site.
  env: {
    NEXT_PUBLIC_DEPLOY_ENV: process.env.VERCEL_ENV ?? "development",
  },
};

export default nextConfig;
