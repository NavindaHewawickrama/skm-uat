// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   output: 'export', // Generates the static 'out' folder
//   images: {
//     unoptimized: true // Required because GitHub Pages doesn't have an image server
//   }
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This creates a static export
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Optional: helps with routing
};

module.exports = nextConfig;
