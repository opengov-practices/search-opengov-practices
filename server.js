var path = require("path");
var express = require("express");
var SearchkitExpress = require("searchkit-express")
var elasticsearch = require("elasticsearch")
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
var compression = require("compression")

var _ = require("lodash")

module.exports = {
  start: function(prodMode) {

    var env = {
      production: process.env.NODE_ENV === 'production'
    };

    var express = require('express');
    var app = express();
    app.use(compression())
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/server/views');
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(methodOverride())

    var port = Number(process.env.PORT || 3000);

    if (!env.production) {
      var webpack = require("webpack");
      var webpackMiddleware = require("webpack-dev-middleware");
      var webpackHotMiddleware = require('webpack-hot-middleware');
      var config = require("./webpack.dev.config.js");
      var compiler = webpack(config);

      app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false
        }
      }));

      app.use(webpackHotMiddleware(compiler));


    } else {
      app.use("/static", express.static(__dirname + '/dist'));
    }

    const EShost = "http://localhost:9200/"
    console.log('ElasticSearch server running at:'+ EShost);

    //Elastic express proxy
    SearchkitExpress({
      host: EShost,
      index:'opengov',
      queryProcessor:function(query, req, res){
        console.log(query)
        return query
      }
    }, app)

    app.get('/', function(req, res) {
      res.render('index');
    });

    app.get('/embed', function(req, res) {
      res.render('embed');
    });

    app.listen(port, function () {
      console.log('Node.js server running at localhost:' + port);
    });
  }
}
