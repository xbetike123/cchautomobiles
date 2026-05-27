import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Request modal accepts a single reference image up to 5MB; allow a
      // little headroom on top of that for the rest of the form payload.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
