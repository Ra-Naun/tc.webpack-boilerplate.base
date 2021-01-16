const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin(),
      new OptimizeCSSAssetsPlugin({
        // cssnano configuration
        cssProcessorPluginOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      }),
    ];
  }

  return config;
};

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: './',
        // hmr: isDev,
        // reloadAll: true,
      },
    },
    {
      loader: 'css-loader',
      options: { importLoaders: 1 },
    },
    'postcss-loader',
  ];

  // [
  //   'style-loader',
  //   {
  //     loader: 'css-loader',
  //     options: { importLoaders: 1 },
  //   },
  //   {
  //     loader: 'postcss-loader',
  //     options: {
  //       postcssOptions: {
  //         plugins: [
  //           [
  //             'postcss-preset-env',
  //             {
  //               // Options
  //             },
  //           ],
  //         ],
  //       },
  //     },
  //   },
  // ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    },
  ];

  //   if (isDev) {
  //     loaders.push('eslint-loader');
  //   }

  return loaders;
};

const babelOptions = (preset) => {
  const opts = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread'],
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const plugins = () => {
  const base = [
    new webpack.HotModuleReplacementPlugin(),
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, 'src/favicon.ico'), to: path.resolve(__dirname, 'dist') }],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ];
  //if (isProd) base.push(new BundleAnalyzerPlugin());
  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.js'],
    analytics: './analytics.ts',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: optimization(),
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 2020,
  },
  // devtool: isDev ? 'source-map' : '',
  plugins: plugins(),

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: babelOptions('@babel/preset-typescript'),
      },
      {
        test: /\.css$/i,
        use: cssLoaders(),
      },
      {
        test: /\.less$/i,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.(sass|scss)$/i,
        use: cssLoaders('sass-loader'),
      },
      // {
      //   test: /\.(png|jpe?g|svg|gif)$/,
      //   use: ['file-loader'],
      // },
      // изображения
      {
        test: /\.(?:ico|gif|png|jpe?g)$/i,
        type: 'asset/resource',
      },

      // {
      //   test: /\.(woff(2)?|eot|ttf|otf)$/,
      //   use: ['file-loader'],
      // },
      // шрифты и SVG
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
    ],
  },
};
