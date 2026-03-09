import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/downloads/Medication-Cost-Savings-Toolkit_v1.md",
        destination: "/downloads/medication-cost-savings-toolkit-v1",
        permanent: true,
      },
      {
        source: "/downloads/Medication-Cost-Savings-Toolkit_v1_PDF-Ready.md",
        destination: "/downloads/medication-cost-savings-toolkit-v1-pdf-ready",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
