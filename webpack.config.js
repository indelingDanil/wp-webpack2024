const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const dotenv = require('dotenv');

// Загружаем переменные окружения
dotenv.config();

module.exports = (env) => {
  const isProduction = process.env.NODE_ENV === "production";
  const siteUrl = process.env.WP_SITE_URL || 'http://localhost'; // Используем переменную или localhost

  return {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "eval",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "assets"),
      filename: "bundle.min.js",
    },
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { url: false },
            },
            "sass-loader",
          ],
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
            compress: {
              drop_console: true,
            },
          },
          extractComments: false,
        }),
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "bundle.min.css",
      }),
      new BrowserSyncPlugin(
        {
          files: ["**/*.php", "assets/*.css", "assets/*.js"],
          proxy: siteUrl, // Используем переменную окружения
          notify: false,
        },
        {
          reload: true,
        }
      ),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "/"),
      },
      hot: true,
      watchFiles: ["**/*.php"],
    },
  };
};
