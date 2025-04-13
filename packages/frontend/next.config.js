/** @type {import('next').Config} */
const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_CLERK_CLIENT_PUBLISHABLE_KEY,
  },
};

module.exports = nextConfig;

