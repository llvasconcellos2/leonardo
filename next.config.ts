import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    // scrollRestoration: true,
    // viewTransition: true, // Enables the React / Next.js View Transitions integration
  },
  async rewrites() {
    return [
      // Serves the main page
      {
        source: "/clinica-facil",
        destination: "/clinica-facil/index.html",
      },
      // Automatically maps your relative "vendor" and asset requests
      {
        source: "/clinica-facil/:path*",
        destination: "/clinica-facil/:path*",
      },
    ];
  },
};

export default nextConfig;
