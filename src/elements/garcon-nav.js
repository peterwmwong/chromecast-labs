Polymer('garcon-nav',{
  selectShow(event, detail, target) {
    this.$.state_show.setValue(target.templateInstance.model.name);
    this.asyncFire('selection');
  }
});
