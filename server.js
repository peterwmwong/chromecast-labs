var path = require('path');

var Hapi = require('hapi');

var videosGet = require('./api/src/videosGet');
var showsGet = require('./api/src/showsGet');
var videoServer = require('./video-server');
var config = require('./config/config.json');


module.exports = {start: function(){
  var server = new Hapi.Server(8081, { files: { relativeTo: __dirname } });
  server.route([

    // /api
    { method: 'GET', path: '/api/shows',  handler: showsGet.go  },

    // [STATIC] /build/**
    { method: 'GET', path: '/build/{path*}',
      handler: { directory: { path: './build/' } } },

    // [STATIC] /bower_components/**
    { method: 'GET', path: '/bower_components/{path*}',
      handler: { directory: { path: './bower_components/' } } },

    // [STATIC] /vendor/**
    { method: 'GET', path: '/vendor/{path*}',
      handler: { directory: { path: './vendor/' } } }

  ]);
  server.start();

  videoServer.start(config.videosDir);
}};
