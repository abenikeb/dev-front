// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     appDir: true,
//     serverComponentsExternalPackages: ["mongoose"],
//   },
//   images: {
//     domains: ['lh3.googleusercontent.com'],
//   },
//   webpack(config) {
//     config.experiments = {
//       ...config.experiments,
//       topLevelAwait: true,
//     }
//     return config
//   }
// }

// module.exports = nextConfig
module.exports = {
  async rewrites() {
    return [
      {
        source: "/gateway/payment/v1/:path*",
        destination: "https://developerportal.ethiotelebirr.et:38443/apiaccess/payment/gateway/payment/v1/:path*",
      },
    ];
  },
};
