/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: {
    "/api/**/*": ["fonts/**/*"],
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
    ],
  },
};

export default nextConfig;
