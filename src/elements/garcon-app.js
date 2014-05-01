Polymer('garcon-app',{

  toggleNav(){
    this.isNavExpanded = !this.isNavExpanded;

    // TODO(pwong): shouldn't it be possible to do a template bind?...
    //              <polymer-element class="{{ isNavExpanded ? 's-nav-expanded' : '' }}">
    this.classList[this.isNavExpanded ? 'add' : 'remove']('s-nav-expanded');
  },

  showVideo(event, detail, target){
    this.$.state_showVideo.setValue(target.templateInstance.model.video);
  },

  // Filters
  // -------

  filterShows(shows, selectedShow){
    return shows && shows.filter(show=>!selectedShow || show.name === selectedShow)
  }

});
