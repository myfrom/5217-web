const path = require('path'),
      CopyWebpackPlugin = require('copy-webpack-plugin'),
      CleanWebpackPlugin = require('clean-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      { InjectManifest } = require('workbox-webpack-plugin');


// Constants
const OUTPUT_PATH = path.resolve(__dirname, 'dist');


module.exports = [{
  mode: 'production',
  entry: [
    path.resolve(__dirname, 'js', 'imports.js')
  ],
  output: {
    path: OUTPUT_PATH,
    filename: 'js/bundle.js'
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
          options: {
            attrs: [ 'img:src', 'script:src', 'link:href' ],
            minimize: true
          }
        }
      ]
    }, {
      test: /js\/5217\.js$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'js/[name]-[hash].js'
          }
        },
        // Isn't necessary and is actually breaking the code
        /* {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env' ],
            cacheDirectory: true
          }
        } */
      ]
    }, {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [ 'es2015' ],
            plugins: [ 'async-import' ],
            cacheDirectory: true
          }
        }
      ],
      exclude: [ path.resolve(__dirname, 'js', '5217.js') ]
    }, {
      test: /\.scss$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'css-[name]-[hash].css'
          }
        },
        { loader: 'extract-loader' },
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: ['./node_modules']
          }
        }
      ]
    }, {
      test: /\.css$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'css-[name]-[hash].css'
          }
        },
        { loader: 'extract-loader' },
        {
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }
      ]
    }, {
      test: /\.(jpe?g|png|svg|woff|woff2|ttf|eot|wav|ico|xml)$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    }, {
      type: 'javascript/auto',
      test: /\.json$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(OUTPUT_PATH),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      minify: true
    }),
    new CopyWebpackPlugin(['./favicon/*', './sound/*', './images/*', './CNAME']),
    new InjectManifest({
      swSrc: './service-worker.js',
      importWorkboxFrom: 'local'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist")
  }
}];