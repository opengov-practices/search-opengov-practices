var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool:"eval",
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index.tsx'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:3000/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
	new ExtractTextPlugin("styles.css", {allChunks:true})
  ],
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
