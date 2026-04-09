/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@supabase/supabase-js', '@supabase/ssr'],
  output: 'export',
  basePath: process.env.GITHUB_PAGES ? '/lego-erp' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '/lego-erp/' : '',
};

module.exports = nextConfig;
