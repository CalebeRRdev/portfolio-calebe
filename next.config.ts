import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The parent folder has a stray lockfile; pin the workspace root to this app
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
