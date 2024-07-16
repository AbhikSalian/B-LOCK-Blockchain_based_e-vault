
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(fbx)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'models',
              name: '[name].[ext]',
            },
          },
        ],
      },
      // other rules...
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.fbx'],
  },
};

module.exports = {
  // ... other configurations ...
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: [
          path.resolve(__dirname, 'node_modules/@chainsafe/is-ip'),
          path.resolve(__dirname, 'node_modules/dag-jose')
        ]
      }
    ]
  }
};
