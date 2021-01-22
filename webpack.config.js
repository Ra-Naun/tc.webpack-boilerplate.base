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

const getOptimization = () => {
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

const getFilename = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`);

const getStyleLoaders = (extra) => {
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

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const getJsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: getBabelOptions(),
    },
  ];

  //   if (isDev) {
  //     loaders.push('eslint-loader');
  //   }

  return loaders;
};

const getBabelOptions = (preset) => {
  const opts = {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-runtime'],
    comments: false,
  };

  if (preset) {
    opts.presets.push(preset);
  }

  return opts;
};

const getPlugins = () => {
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
      filename: getFilename('css'),
    }),
  ];
  //if (isProd) base.push(new BundleAnalyzerPlugin());
  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['./index.js'],
    analytics: './analytics.ts',
  },
  output: {
    filename: getFilename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: getOptimization(),
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    hot: true,
    port: 2021,
  },
  //isDev && devtool: 'source-map',
  plugins: getPlugins(),

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: getJsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: getBabelOptions('@babel/preset-typescript'),
      },
      {
        test: /\.css$/i,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/i,
        use: getStyleLoaders('less-loader'),
      },
      {
        test: /\.(sass|scss)$/i,
        use: getStyleLoaders('sass-loader'),
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

      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      // шрифты и SVG
      // {
      //   test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
      //   type: 'asset/inline',
      // },
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
