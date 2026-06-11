import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Overridable so a second dev instance (e.g. preview tooling) can run
  // alongside `next dev` without fighting over the .next lock.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
