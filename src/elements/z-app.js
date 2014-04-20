Polymer('z-app',{
  videosChanged(old, videos) {
    if (videos) {
      var showMap = videos.reduce((showMap, video)=>{
          if (!showMap[video.name]) {
            showMap[video.name] = [];
          }
          showMap[video.name].push(video);
          return showMap;
        },{});

      this.shows = Object.keys(showMap).map((showName)=>{
        return {
          name:   showName,
          videos: showMap[showName].sort((a,b)=>{return a.episode - b.episode;})
        };
      });
    }
  }
});
