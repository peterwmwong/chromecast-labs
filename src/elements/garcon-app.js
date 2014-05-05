Polymer('garcon-app',{

  videoServerHostName: window.location.hostname,

  toggleNav(){
    this.isNavExpanded = !this.isNavExpanded;

    // TODO(pwong): shouldn't it be possible to do a template bind?...
    //              <polymer-element class="{{ isNavExpanded ? 's-nav-expanded' : '' }}">
    this.classList[this.isNavExpanded ? 'add' : 'remove']('s-nav-expanded');
  },

  showVideo(event, detail, target){
    this.$.state_showVideo.setValue(target.templateInstance.model.video);
  },

  hideVideo(){
    this.$.state_showVideo.setValue(null);
  },

  showsChanged(old, shows){
    if(shows){
      this.$.state_showVideo.setValue(shows[0].videos[0]);
      for(var i=0; i<4; ++i)
        shows[0].videos.push(shows[0].videos[0]);

      for(i=0; i<25; ++i)
        shows.push(shows[0]);
    }
  },

  // Filters
  // -------

  filterShows(shows, selectedShow){
    return shows && shows.filter(show=>!selectedShow || show.name === selectedShow)
  }

});
