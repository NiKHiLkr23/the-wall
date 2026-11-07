import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [{ source: "/home", destination: "/", permanent: true }];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
        {
          key: "Content-Security-Policy",
          // Limit embedding and document capabilities without changing Next's
          // inline hydration scripts or the optional analytics integration.
          value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
        },
      ],
    }];
  },
};

export default nextConfig;
