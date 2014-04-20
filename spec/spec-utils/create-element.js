// 
// `createElement(html, context)`
//
// Creates an element with context for binding
//
// Params
// ------
//
// html:string    - HTML string with 1 root element
// context:object - Object used as the context for binding
//
// Returns
// -------
//
// A `Promise` that resolves to the root element rendered from `html`
//
// Examples
// --------
//
//   await createElement('<span>Hello {{name}}</span>', {name:'Mr. Selfridge'});
//   > <span>Hello Mr. Selfridge</span>
//
var tempdivs = [];

export default function createElement(html, context){
  return new Promise((resolve)=>{
    var thediv = document.createElement('div');
    tempdivs.push(document.body.appendChild(thediv));

    // Create a template element and bind the context to `model`
    thediv = document.createElement('div');
    thediv.innerHTML = '<template bind="{{}}">'+html+'</template>';
    thediv.firstChild.model = context || {};

    // TODO(pwong): Remove when everything goes native
    Platform.flush();

    // Elements will upgraded asynchronously natively
    setTimeout(()=>resolve(thediv.children[1]), 0);
  });
}


afterEach(function(){
  tempdivs.forEach(div=>div.remove());
  tempdivs = [];
});
