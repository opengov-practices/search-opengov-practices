var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/index.tsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
    css: 'styles.css'
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react')
    },
    extensions:[".js", ".ts", ".tsx","", ".webpack.js", ".web.js"],
    fallback: path.join(__dirname, "node_modules")
  },
  resolveLoader: {
    root: path.join(__dirname, "node_modules")
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin("styles.css", {allChunks:true}),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['require', 'export', '$super']
      },
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: [
          'react-hot',
          'babel-loader',
          'ts-loader'
        ],
        include: path.join(__dirname, 'src'),
		exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
		loader: ExtractTextPlugin.extract("style-loader","css-loader!sass-loader")
      },
      // loaders for font-awesome fonts 
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
	    loader: 'url-loader?limit=10000&minetype=application/font-woff'
	  },
      { test: /\.(ttf|eot|jpg|png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
	    loader: 'file-loader'
	  }
    ]
  }
};
