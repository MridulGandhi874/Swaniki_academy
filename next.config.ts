import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // firebase-admin's dependency tree (grpc, gcp-metadata, etc.) has dynamic
  // requires that Next.js's serverless bundler mis-bundles, causing routes
  // that import it to crash at runtime in production while working fine in
  // `next dev`. Keeping it external forces a plain node_modules require at
  // runtime instead of bundling it in.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
