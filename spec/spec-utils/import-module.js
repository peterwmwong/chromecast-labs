// 
// `importModule(moduleId, modulesToMock)`
//
// Import a module with specified dependencies replaced with mocks.
//
// Params
// ------
//
// moduleId:string      - Module id to import
// modulesToMock:object - Map of module id's to mock module definitions.
//
// Returns
// -------
//
// A `Promise` that resolves to the imported module.
//
// Examples
// --------
//
//   await importModule('mymodule', {'myDendencyModule':jasmine.createSpy()});
//   > MyModule
//

export default function importModule(moduleid,mocks = {}){
  // Create an ES6 Custom Loader
  var loader = new Loader({
    normalize: System.normalize,
    locate: System.locate,
    fetch: System.fetch,
    translate: System.translate,
    instantiate: System.instantiate
  });

  // TODO(pwong): Shouldn't be necessary, maybe a bug in SystemJS AMD format...
  loader.defined = {};
  loader.bundles = {};
  loader.paths = System.paths;
  loader.getModule = System.getModule;

  // Load the mock modules into the custom loader
  for (var mockid in mocks) {
    // TODO(pwong): Shouldn't be necessary, maybe a bug in SystemJS AMD format...
    var mock = Object.create(mocks[mockid]);
    mock.__esModule = true;

    loader.set(mockid, new Module(mock));
  }

  window.System = loader;
  return loader.import(moduleid);
};

var origSystem = window.System;
afterEach(function(){
  window.System = origSystem;
});
