import path from "node:path";
import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(import.meta.dirname, "../../"),
};

export default createMDX()(nextConfig);
