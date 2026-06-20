import type { NextConfig } from "next";

const nextConfig: any = {
  allowedDevOrigins: ['gloomy-variety-persecute.ngrok-free.dev', '*.ngrok-free.dev'],
  // The former Express backend (live ticker, market news, stock quotes, leads) has been
  // migrated into native Next.js API routes under /api, so the app deploys as a single unit.
};

export default nextConfig;
