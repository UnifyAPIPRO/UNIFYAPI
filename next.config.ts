import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Emit a self-contained server build for Docker / self-hosting.
  output: "standalone",
};

export default nextConfig;
