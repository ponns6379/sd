/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Images may live on Supabase Storage; skip the optimizer so any host works and Vercel quotas aren't used.
  images: { unoptimized: true },
  serverExternalPackages: ['@electric-sql/pglite', 'postgres', 'bcryptjs'],
  // Make sure the seed JSON ships with serverless deployments (e.g. Vercel)
  outputFileTracingIncludes: { '/**': ['./data/seed/**'] },
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [{ source: '/books', destination: '/academic-contributions', permanent: true }];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
