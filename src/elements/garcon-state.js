var state = {};

Polymer('garcon-state',{

  setValue(value){
    state[this.key] = value;
  },

  keyChanged(old, key){
    if(this._observer)
      this._observer.close();

    if(typeof key === 'string') {
      this._observer = new PathObserver(state, key);
      this._observer.open(this.handleValueChange, this);
      this.handleValueChange(state[key], undefined);
    }
  },

  handleValueChange(value, old){
    this.value = value;
  },

  ready(){
    this._observer = new PathObserver(state, '');
  }
});
