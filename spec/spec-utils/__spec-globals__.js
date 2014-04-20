// Global convenience functions and constants for specs.

//
// `await platformFlush()`
//
// Used to ensure the platform has performed all the end-of-microtask tasks. This
// ensures the following things have taken effect...
//   - A new `<polymer-element>` declarations has (see `createElement()`) has been
//     registered and ready to be used
//   - Changings to bindings
//
// Returns
// -------
//
// A `Promise` that resolves when the end-of-microtask has completed.
//
window.platformFlush = function(){
  return new Promise(function (resolve){
    Platform.flush();
    setTimeout(resolve,0);
  })
};
