/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export served as Cloudflare Workers Static Assets (see wrangler.jsonc)
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
