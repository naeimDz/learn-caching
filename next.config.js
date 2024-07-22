
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Customize the output filenames
    config.output.chunkFilename = `static/${buildId}/[name].js`;

    // Return the updated config
    return config;
  },
};

module.exports = nextConfig;





  /*async headers() {
      return [
        {
          source: '/images/:all*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.output.filename = `static/${buildId}/[name].js`;
      config.output.chunkFilename = `static/${buildId}/[name].js`;
      return config;
    }, */