var Hapi = require('hapi');
var videosGet = require('./api/src/videosGet');
var showsGet = require('./api/src/showsGet');

var server = new Hapi.Server(8081, { files: { relativeTo: __dirname } });
server.route([

  // /api
  { method: 'GET', path: '/api/shows',  handler: showsGet.go  },
  { method: 'GET', path: '/api/videos', handler: videosGet.go },


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

module.exports = { start: server.start.bind(server) };
