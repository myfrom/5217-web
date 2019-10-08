const path = require('path'),
      CopyWebpackPlugin = require('copy-webpack-plugin'),
      { CleanWebpackPlugin } = require('clean-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      { InjectManifest } = require('workbox-webpack-plugin');

module.exports = [{
  mode: 'production',
  entry: [
    path.resolve(__dirname, 'js', 'app.js')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
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
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env' ],
            plugins: [ 'async-import' ],
            // cacheDirectory: true
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
        { loader: 'css-loader' },
        {
          loader: 'sass-loader',
          options: {
            sassOptions: {
              includePaths: ['./node_modules']
            },
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
        { loader: 'css-loader' }
      ]
    }, {
      test: /\.(jpe?g|png|svg|wav|ico|xml)$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    }, {
      test: /\.(woff|woff2|ttf|eot)$/,
      loader: 'file-loader',
      options: {
        name: 'fonts/[name].[ext]'
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
    new CleanWebpackPlugin(),
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
