videosGet = require('./videosGet');

module.exports = {
  go: function(req, reply){
    videosGet.go(null, function(videos){
      reply(videos.reduce(function(acc, video){
        if(video.show){
          if(!acc.map[video.show]){
            acc.shows.push(
              acc.map[video.show] = {
                name: video.show,
                videos: []
              }
            );
          }
          acc.map[video.show].videos.push(video);
        }
        return acc;
      },{map:{}, shows:[]}).shows);
    })
  }
};
