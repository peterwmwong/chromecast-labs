//
// `mockElement({name,attributes,proto})`
//
// Mocks a Polymer element.  Useful for testing an element that has dependencies.
//
// Params
// ------
//
// name:string        - The name of the Polymer element to mock.
// attributes:string  - Space delimited list of attributes for the mock Polymer
//                      element.
// proto:object       - Prototype object for the mock Polymer element.
//
// Returns
// -------
//
// A `Promise` that resolves once mocking is complete.
//
// Examples
// --------
//
//   await mockElement({ name:'myElement', attributes:'message', prototype:{
//     ready(){
//       console.log('Not myElement, but mock myElement!');
//     }
//   }});
//

// Map of elements to their mocks
var elementToMock = {};

// Save the original `CustomElement.upgrade()`, to be called by mocked version
// later restored once the spec completes.
var origUpgrade = CustomElements.upgrade;

// A version of `CustomElements.upgrade(element)`, that tricks the custom
// element algorithm to upgrade the element as if it were the mocked element.
function upgradeWithMocks(element){
  // Look up the name of mock for an element (if there is one)
  var mockName = elementToMock[element.localName];

  // ... if there is a mock, then trick the upgrade algorithm into upgrading
  // the element as if were the mock element
  if(mockName) Object.defineProperty(element, 'localName', {value:mockName});

  // Let the normal element upgrade take place
  return origUpgrade.call(CustomElements, element);
}

beforeEach(function(){
  // Hook into `CustomElements.upgrade()`
  if (CustomElements.upgrade !== upgradeWithMocks)
    CustomElements.upgrade = upgradeWithMocks;
});

afterEach(function(){
  // Reset mock element registry
  elementToMock = {};
  CustomElements.upgrade = origUpgrade;
});

export default function mockElement({name, attributes, proto}){
  return new Promise((resolve, reject)=>{
    if (elementToMock[name]) {
      reject();
      return;
    }

    // Generate a unique name for the mock polymer-element
    var mockName = `mock-element${Date.now()}`;

    // Define and register mock polymer-element
    Polymer(mockName, proto);
    var div = document.createElement('div');
    div.innerHTML = `<polymer-element name='${mockName}' attributes='${attributes || ''}'/>`;
    document.body.appendChild(div);

    elementToMock[name] = mockName;

    platformFlush().then(function(){
      div.remove();
      resolve();
    })
  });
};
