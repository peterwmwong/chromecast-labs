# chromecast-labs

## Development Setup

    npm install
    npm install -g bower
    bower install
    npm install -g gulp
    gulp dev

- Visit [http://localhost:8081/build/](http://localhost:8081/build/)

### after pulling new code...

    npm install     # Keep up-to-date with deps
    bower install
    gulp dev        # Build all assets

## Deploying

    git checkout gh-pages
    git merge master
    gulp prod
    git commit -am "Deploy"
    git push origin gh-pages


- Visit [http://peterwmwong.github.io/chromecast-labs/build](http://peterwmwong.github.io/chromecast-labs/build)

## Tests

_Not yet_ :)

## Key Technologies

- [Polymer](http://www.polymer-project.org/)
- [ES6 Traceur](https://github.com/google/traceur-compiler)
- [LibSass](http://libsass.com/)
  - [Bourbon](http://bourbon.io/)
- [Jade](http://jade-lang.com/)
- [Bower](http://bower.io/)
- [Gulp](http://gulpjs.org/)
- LiveReload via [tiny-lr](https://github.com/mklabs/tiny-lr)
