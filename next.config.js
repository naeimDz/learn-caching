
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
  webpack: (config, { buildId, dev }) => {
    const newConfig = config;

    if (!dev && newConfig.output.filename.startsWith('static')) {
        newConfig.output.filename = newConfig.output.filename.replace('[name]', `[name]-${buildId}`);
        newConfig.output.chunkFilename = newConfig.output.chunkFilename.replace('[name]', `[name]-${buildId}`);
    }

    return newConfig;
},
generateBuildId: async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    return `build-${timestamp}`;
},
};

module.exports = nextConfig





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