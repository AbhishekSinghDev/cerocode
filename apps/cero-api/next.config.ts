import type { NextConfig } from "next";
import { env } from "./src/env";

const config: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/auth/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: env.NEXT_PUBLIC_WEBSITE_URL,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default config;
