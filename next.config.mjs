/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 is a native module and must not be bundled by Turbopack.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
