var assert = require('assert');
var child_process = require('child_process');
var config = require('../../config/config.json');
var sinon = require('sinon');

var fixtureVideoFileListings = require('../spec-fixtures/video-file-listings');
var videosGet = require('../src/videosGet');

describe("videosGet.normalizeNameDelimiter(showName):string", function(){
  it("converts '.' to spaces", function(){
    assert.equal(
      videosGet.normalizeNameDelimiter("the.walking.dead"),
      "the walking dead"
    );
  });
  it("preserves spaces", function(){
    assert.equal(
      videosGet.normalizeNameDelimiter("the walking dead"),
      "the walking dead"
    );
  });
});

describe("videosGet.transformWords(normalizedShowName):string", function(){
  it("Capitalize the first letter of each word", function(){
    assert.equal(
      videosGet.transformWords("the walking dead"),
      "The Walking Dead"
    );
  });

  describe("except when the middle word is...", function(){
    ['the','to','with','of'].forEach(function(exceptionWord){
      it(exceptionWord, function(){
        assert.equal(
          videosGet.transformWords("blah "+exceptionWord+" blah"),
          "Blah "+exceptionWord+" Blah"
        );
      });
    });
  });
});

describe("videosGet.getVideoFromFilename(filename):Video", function(){
  it("parses name, season, and episode information from all an example file listing", function(){
    Object.keys(fixtureVideoFileListings).forEach(function(path){
      var expected = JSON.parse(JSON.stringify(fixtureVideoFileListings[path]));
      expected.file = path;
      assert.deepEqual(videosGet.getVideoFromFilename(path), expected);
    });
  });

  it("parses video files with no name, season, or episode information", function(){
    assert.deepEqual(videosGet.getVideoFromFilename("blah blah blah.mp4"), {
      file: "blah blah blah.mp4"
    });
  });
});

describe("videosGet.go(request:object, reply:function)",function(){
  beforeEach(function(){
    this.execStub = sinon.stub(child_process, 'exec', function(cmd, cb){
      cb(undefined, 'a/b/c.mp4\nd/e.mp4\nf.mp4', undefined);
    });

    sinon.stub(videosGet, 'getVideoFromFilename', function(videoPath){
      return {
        'a/b/c.mp4': '1',
        'd/e.mp4':   '2',
        'f.mp4':     '3'
      }[videoPath];
    })

    this.config_videosDir_orig = config.videosDir;
    config.videosDir = "mock/video/dir";
  });

  afterEach(function(){
    videosGet.getVideoFromFilename.restore();
    child_process.exec.restore();
    config.videosDir = this.config_videosDir_orig;
  })

  it("responds with a list of videos",function(done){
    videosGet.go(null, function(videos){
      assert.deepEqual(videos, ['1', '2', '3']);
      done();
    });
    assert.equal(this.execStub.firstCall.args[0], 'find mock/video/dir -name "*.mp4"');
  });
});
