Polymer('garcon-app',{

  toggleNav() {
    if(this.$.animateNav.player) {
      this.$.animateNav.cancel();
    }

    this.isNavExpanded = !this.isNavExpanded;
    this.$.animateNav.direction = this.isNavExpanded ? 'normal' : 'reverse';
    this.$.animateNav.play();
  },

  // Change Listeners
  // ----------------

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
