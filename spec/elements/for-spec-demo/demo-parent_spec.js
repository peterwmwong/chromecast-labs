import createElement from '../../spec-utils/create-element';
import mockElement from '../../spec-utils/mock-element';

describe('demo-parent',function(){

  beforeEach(async function(done){
    await mockElement({name:'demo-child', attributes:'childmessage'});
    this.el = await createElement('<demo-parent message="{{foo}}"/>',{foo:'bar'});
    this.getEl = selector=>this.el.shadowRoot.querySelector(selector)
    done();
  });

  describe('renders a `<child-message>`', function(){
    it('passes `"Hello World"` via `@childmessage`', function(){
      expect(this.getEl('demo-child').attributes.childmessage.value)
        .toBe('Hello World');
    });
  });

  it('renders message', function(){
    expect(this.getEl('.message').textContent.trim())
      .toBe('Received message: bar');
  });
});
