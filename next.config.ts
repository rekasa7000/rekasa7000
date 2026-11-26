import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/farm", destination: "/artifacts/farm", permanent: false }];
  },
};

export default nextConfig;
