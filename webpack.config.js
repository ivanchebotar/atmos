const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.js',
  },
  module: {
    rules: [
      // Load HTML files
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      // Load and Minify SCSS files
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into a separate file
          'css-loader', // Loads CSS into JavaScript
        ],
      },
      // Handle SCSS files
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS to a separate file
          'css-loader', // Loads CSS
          'sass-loader', // Compiles SCSS to CSS
        ],
      },
      // Handle JS files
      {
        test: /\.js$/, // Matches JavaScript files
        exclude: /node_modules/, // Excludes node_modules for performance
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"], // Transpile ES6+ to ES5
          },
        },
      },
      // Load and optimize images (PNG, JPG, GIF)
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext][query]', // Save images in 'assets/images/'
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 75, // Adjust quality for JPEGs
              },
              pngquant: {
                quality: [0.65, 0.90], // Adjust quality range for PNGs
                speed: 4, // Speed of optimization
              },
              gifsicle: {
                interlaced: false, // Optimize GIFs
              },
              webp: false, // Disable WebP conversion
            },
          },
        ],
      },
      // Load and copy fonts (woff, woff2, eot, ttf)
      {
        test: /\.(woff|woff2|eot|ttf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext][query]', // Save fonts in 'assets/fonts/'
        },
      },
      // Load and copy videos (mp4)
      {
        test: /\.mp4$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/videos/[name][ext][query]', // Save videos in 'assets/videos/'
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean up the dist folder before each build
    new HtmlWebpackPlugin({
      template: './src/views/index.html', // Use the template for the HTML file
      inject: true, // Inject JS and CSS into the HTML file
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css', // Extract CSS to a separate file
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true,
    open: true,
    port: 3000,
  },
};
