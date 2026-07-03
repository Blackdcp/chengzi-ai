import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/zh',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/zh/products',
        permanent: true,
      },
      {
        source: '/guides',
        destination: '/zh/guides',
        permanent: true,
      },
      {
        source: '/api-service',
        destination: '/zh/api-service',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/plus-dual',
        destination: '/:lang/products/chatgpt-plus-monthly-code',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/chatgpt-plus',
        destination: '/:lang/products/chatgpt-plus-monthly-code',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/gpt-plus',
        destination: '/:lang/products/chatgpt-plus-monthly-code',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/gemini-pro',
        destination: '/:lang/products/gemini-pro-year-account',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/plus-renewal',
        destination: '/:lang/products/chatgpt-plus-renewal',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/ready-account',
        destination: '/:lang/products/chatgpt-plus-ready-account',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/pro',
        destination: '/:lang/products/chatgpt-pro-20x-fast',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/chatgpt-pro',
        destination: '/:lang/products/chatgpt-pro-20x-fast',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/api-100',
        destination: '/:lang/api-service',
        permanent: true,
      },
      {
        source: '/:lang(zh|en)/products/api-300',
        destination: '/:lang/api-service',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://1key6868.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
