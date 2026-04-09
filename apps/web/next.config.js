/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@supabase/supabase-js', '@supabase/ssr'],
  output: 'export',
  basePath: '/lego-erp',
  assetPrefix: '/lego-erp/',
};

module.exports = nextConfig;
