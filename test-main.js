// This file bootstraps the Karma tests by...
//   - Loading all spec files
//   - Setting up Polymer by importing `polymer.html` and all elements from `build/elements/`
//   - Starts the Karma tests once both specs are loaded and Polymer is setup
(function(){

// make it async
window.__karma__.loaded = function() {};

// Import Polymer
document.write('<link rel="import" href="/base/bower_components/polymer/polymer.html"></link>');

var allTestFiles = [];
Object.keys(window.__karma__.files).forEach(function(file) {
  // Add all spec js files
  if (/spec_build\/.*(spec|test)\.js$/i.test(file)) {
    // Normalize paths to module names.
    allTestFiles.push(file.replace(/^\//, '').replace(/\.js$/, ''));

  // Import Polymer elements
  } else if (/build\/elements.*\.html$/i.test(file)) {
    document.write('<link rel="import" href="'+file+'"></link>');
  }
});

// TODO(pwong): I wonder if we could refactor these out somehow...
System.paths['elements/*'] = '/base/build/elements/*.js';
System.paths['models/*'] = '/base/build/models/*.js';
System.paths['data/*'] = '/base/build/data/*.js';

Promise.all(
  // Import all specs
  allTestFiles
    .map(System.import)
    // Wait for all web components to be loaded
    .concat(new Promise(function(resolve){
      window.addEventListener('polymer-ready',resolve);
    }))
).then(platformFlush)
 .then(window.__karma__.start);

// Auto-reruns specs with LiveReload
if (/debug.html$/.test(window.location.pathname)) {
  document.write("<script src='http://" + (location.host || 'localhost').split(':')[0] + ":35729/livereload.js?snipver=1'></" + "script>");
}

})();
