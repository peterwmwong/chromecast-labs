import createElement from '../spec-utils/create-element';

function flush() {
  return new Promise(function(resolve){
    setTimeout(function() {
      Platform.performMicrotaskCheckpoint();
      resolve();
    }, 0);
  });
};

describe('garcon-state',function(){
  beforeEach(async function(done){
    this.context = {value:'initial value'};
    this.el = await createElement(
                      '<garcon-state key="key1" value="{{value}}" />',
                      this.context);
    done();
  });

  it('on creation, assigns state value to bound variable in `value`', function(){
    expect(this.context.value).toBeUndefined();
  });

  describe('`setValue(newValue)`', function(){
    beforeEach(async function(done){
      this.el2 = await createElement('<garcon-state key="key1" />', {});
      this.el2.setValue('new value');

      await flush();
      done();
    });

    it('assigns initial value of `key` to bound variable in `value`', function(){
      expect(this.context.value).toBe('new value');
    });
  });
});
