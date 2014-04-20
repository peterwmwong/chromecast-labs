/* global require, __dirname, process */

var changed    = require('gulp-changed');
var clean      = require('gulp-clean');
var connect    = require('gulp-connect');
var fs         = require('fs');
var gulp       = require('gulp');
var gutil      = require('gulp-util');
var jade       = require('gulp-jade');
var jadeLib    = require('jade');
var karma      = require('karma');
var livereload = require('gulp-livereload');
var path       = require('path');
var plumber    = require('gulp-plumber');
var sass       = require('gulp-ruby-sass');
var tinylr     = require('tiny-lr');
var traceur    = require('gulp-traceur');
var vulcanize  = require('vulcanize');

// Constants
// ---------

var IS_PROD    = process.argv[2] === 'prod';
var SRC_DIR    = './src/';
var BUILD_DIR  = './build/';

var SPEC_SRC_DIR    = './spec/';
var SPEC_BUILD_DIR  = './spec_build/';

// Cleanup Tasks
// -------------

gulp.task('clean', function() {
  return gulp.src(BUILD_DIR, {read: false})
             .pipe(clean());
});

gulp.task('spec-clean', function() {
  return gulp.src(SPEC_BUILD_DIR, {read: false})
             .pipe(clean());
});

// Static Server
// -------------

gulp.task('server', function(){
  connect.server({
    livereload: false,
    port: 8081,
    root: [__dirname]
  });
});

// Compile Tasks
// -------------

var makeCompileScss = function(checkChanged){
  return function(){
    return gulp.src(SRC_DIR+'**/*.scss')
               .pipe(plumber())
               .pipe(checkChanged ? changed(BUILD_DIR, {extension:'.css'}) : gutil.noop())
               .pipe(sass({
                 bundleExec: true,
                 loadPath: ['src/styles','vendor/bourbon'],
                 sourcemap: true
               }))
               .pipe(gulp.dest(BUILD_DIR));
  };
};
var compileScssUnchanged = makeCompileScss(true);
var compileScss          = makeCompileScss(false);

var compileJs = function(){
  return gulp.src(SRC_DIR+'**/*.js')
             .pipe(changed(BUILD_DIR))
             .pipe(plumber())
             .pipe(traceur({ sourceMap: !IS_PROD, modules: 'amd' }))
             .pipe(gulp.dest(BUILD_DIR));
};

// Automatically include all mixins in the `src/template/mixins/` directory
var JadeParserWithMixins = (function(){
  var includeMixinsSrc = fs.readdirSync('src/template/mixins')
                           .reduce(function(acc, mixinFn){
                                return acc + 'include /mixins/'+mixinFn.replace(/.jade$/,'')+'\n';
                            },'');
  var NewParser = function(str, filename, options){
    jadeLib.Parser.call(this, includeMixinsSrc + str, filename, options);
  };
  NewParser.prototype = jadeLib.Parser.prototype;
  return NewParser;
})();

var compileJade = function(){
  return gulp.src(SRC_DIR+'**/*.jade')
             .pipe(changed(BUILD_DIR, {extension:'.html'}))
             .pipe(plumber())
             .pipe(jade({
                pretty:true,
                basedir:'src/template/',
                parser:JadeParserWithMixins,
                locals: { isProd: IS_PROD }
              }))
             .pipe(gulp.dest(BUILD_DIR));
};

gulp.task('templates', ['clean'], compileJade);
gulp.task('styles',    ['clean'], compileScssUnchanged);
gulp.task('code',      ['clean'], compileJs);

gulp.task('templates-noclean',  compileJade);
gulp.task('styles-noclean',     compileScssUnchanged);
gulp.task('styles-all-noclean', compileScss);
gulp.task('code-noclean',       compileJs);


// Test Tasks
// ----------
var compileSpecJs = function(){
  return gulp.src(SPEC_SRC_DIR+'**/*.js')
             .pipe(changed(SPEC_BUILD_DIR))
             .pipe(plumber())
             .pipe(traceur({ sourceMap: true, modules: 'amd', asyncFunctions: true }))
             .pipe(gulp.dest(SPEC_BUILD_DIR));
};

gulp.task('test-dev', ['spec','livereload'], function(){
  karma.server.start({configFile: path.resolve('./karma.conf.js')} );
});
gulp.task('spec', ['spec-clean'], compileSpecJs);
gulp.task('spec-noclean', compileSpecJs);


// Watch Tasks
// -----------

gulp.task('watch-templates', ['templates'], function(){
  gulp.watch(SRC_DIR+'**/*.jade', ['templates-noclean']);
});

gulp.task('watch-styles', ['styles'], function(){
  gulp.watch(SRC_DIR+'**/*.scss', ['styles-noclean']);
});

// Do a full build when common styles are changed
gulp.task('watch-styles-common', ['styles'], function(){
  gulp.watch(SRC_DIR+'styles/**/*.scss', ['styles-all-noclean']);
});

gulp.task('watch-code', ['code'], function(){
  gulp.watch(SRC_DIR+'**/*.js', ['code-noclean']);
});

gulp.task('watch-spec', ['spec'], function(){
  gulp.watch(SPEC_SRC_DIR+'**/*.js', ['spec-noclean']);
});

gulp.task('livereload', ['watch-templates',
                         'watch-styles',
                         'watch-styles-common',
                         'watch-code',
                         'watch-spec'], function(){
  // TODO(pwong): temporary to force a full page reload on CSS change. This is
  //              necessary as Polymer style importing currently cannot be
  //              liveCss-ed due to polyfill style munging.
  var port = 35729;
  var tinylrServer = tinylr({liveCss:false});
  tinylrServer.listen(port, function (err) {
    if (err){ throw new gutil.PluginError('gulp-livereload', err.message); }
    gutil.log('Live reload server listening on: ' + gutil.colors.magenta(port));
  });

  var server = livereload(tinylrServer);
  gulp.watch(BUILD_DIR+'**/*.{js,css,html}',function(event){
    server.changed(event.path);
  });
  gulp.watch(SPEC_BUILD_DIR+'**/*.js',function(event){
    server.changed(event.path);
  });
});

// CLI Tasks
// ---------

gulp.task('test', ['spec','templates','styles','code'], function(done){
  karma.server.start({autoWatch: false, singleRun: true, configFile: path.resolve('./karma.conf.js')},function(){
    done();
    process.exit();
  });
});
gulp.task('dev',     ['livereload','server']);
gulp.task('default', ['templates', 'styles', 'code']);
gulp.task('prod',    ['default'], function () {
  vulcanize.setOptions({
    inline: true,
    strip: true,
    input: 'build/index.html',
    output: 'build/index.html'
  },function(){
    vulcanize.processDocument();
  });
});
