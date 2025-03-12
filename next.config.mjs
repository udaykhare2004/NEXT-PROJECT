/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { // ✅ `remotePatterns` must be inside `images`
      remotePatterns: [
        {
          protocol: "https",
          hostname: "images.pexels.com",
          port: "", // ✅ Leave this empty unless needed
        },
      ],
    },
  };
  
  export default nextConfig;
  