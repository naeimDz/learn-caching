module.exports = {
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
      config.output.filename = `static/${buildId}/[name].js`;
      config.output.chunkFilename = `static/${buildId}/[name].js`;
      return config;
    },
  };