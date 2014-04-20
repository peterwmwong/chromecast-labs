(function(){

var proto = {

  // When `@fetchEvery` is set, this will be set to the function that
  // periodically fetch data at a rate of `@fetchEvery` seconds.
  _fetchEveryJob: null,

  config: null,
  isConfigured: false,

  configure({requestToken}) {
    if (requestToken) {
      proto.config = proto.config || {};
      proto.config.requestToken = requestToken;
      proto.isConfigured = true;
      window.localStorage.setItem('z-github-api-config',JSON.stringify(proto.config));
    }
  },

  resetConfig() {
    if (proto.config) {
      proto.config = null;
      proto.isConfigured = false;
      window.localStorage.removeItem('z-github-api-config');
    }
  },

  fetchEveryChanged() {
    // If the job function is already install, don't do anything.
    // The job function will pick up the new value on it's next execution.
    if (this._fetchEveryJob) return;

    // Install the job function that periodically fetches new data
    this._fetchEveryJob = ()=> {
      var delay = +this.fetchEvery;
      if(delay) {
        setTimeout(()=>{
          this.fetch();
          this._fetchEveryJob();

        // Limit to every 10 seconds, to prevent reaching Github API rate limits
        // to quickly.
        }, delay >= 10 ? delay * 1000 : 10000 );

      } else {
        // Uninstall job until a reasonable `@fetchEvery` has been set
        this._fetchEveryJob = null;
      }
    };

    this._fetchEveryJob();
  },

  fetch() {
    var pjx = this.shadowRoot.querySelector('.ajax-data');
    if (pjx) pjx.go();
  },

  onPageResponse(event, response) {
    this.response = this.response.concat(response.response);
  },

  onResponse(event,response){
    var link = response.xhr.getResponseHeader('link');

    if (link) {
      var rels = link.split(',');
      if (rels && rels[1]) {
        rels.forEach((rel)=>{
          var match = /<.*page=(\d+)>; rel="last"/.exec(rel);
          if (match && match[1]) {
            this.pages = Array.apply(0,Array((+match[1]) - 1)).map((o,i)=>i+2);
          }
        });
      }
    }
  }
};

try {
  // Attempt to retrieve and desierialize configuration
  proto.config = JSON.parse(window.localStorage.getItem('z-github-api-config'));
  if (proto.config) proto.isConfigured = true;
}catch(e){
  // Assume the corrupted localStorage entry and remove entry
  try { window.localStorage.removeItem('z-github-api-config'); }catch(e2){}
}

Polymer('z-github-api', proto);

})();
