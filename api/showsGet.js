videosGet = require('./videosGet');

module.exports = function(req, reply){
  videosGet(null, function(videos){
    reply(videos.reduce(function(acc, video){
      if(video.show){
        if(!acc.map[video.show]){
          acc.shows.push(
            acc.map[video.show] = {
              name: video.show,
              videosCount: 0
            }
          );
        }
        ++acc.map[video.show].videosCount;
      }
      return acc;
    },{map:{}, shows:[]}).shows);
  })
}
