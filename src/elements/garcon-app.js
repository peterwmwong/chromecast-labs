Polymer('garcon-app',{

  toggleNav() {
    this.isNavExpanded = !this.isNavExpanded;

    // TODO(pwong): shouldn't it be possible to do a template bind?...
    //              <polymer-element class="{{ isNavExpanded ? 's-nav-expanded' : '' }}">
    this.classList[this.isNavExpanded ? 'add' : 'remove']('s-nav-expanded');
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