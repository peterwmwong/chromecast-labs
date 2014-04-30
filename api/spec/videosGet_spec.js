var assert = require('assert');
var child_process = require('child_process');
var config = require('../../config/config.json');
var fixtureVideoFileListings = require('../spec-fixtures/video-file-listings');
var path = require('path');
var sinon = require('sinon');
var videosGet = require('../src/videosGet');

describe("videoGet",function(){
  describe("#go(request:object, reply:function)",function(){
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

  describe("#normalizeNameDelimiter(showName):string", function(){
    it("converts '.' to spaces", function(){
      assert.equal(
        videosGet.normalizeNameDelimiter("the.walking.dead"),
        "the walking dead");
    });

    it("preserves spaces", function(){
      assert.equal(
        videosGet.normalizeNameDelimiter("the walking dead"),
        "the walking dead");
    });
  });

  describe("#transformWords(normalizedShowName):string", function(){
    it("Capitalize the first letter of each word", function(){
      assert.equal(
        videosGet.transformWords("the walking dead"),
        "The Walking Dead");
    });

    describe("except when the middle word is...", function(){
      ['the','to','with','of'].forEach(function(exceptionWord){
        it(exceptionWord, function(){
          assert.equal(
            videosGet.transformWords("blah "+exceptionWord+" blah"),
            "Blah "+exceptionWord+" Blah");
        });
      });
    });

    it("Remove a show's year", function(){
      assert.equal(
        videosGet.transformWords("The Americans 2013"),
        "The Americans ");

      // Should preserve years in the middle of the show's name
      assert.equal(
        videosGet.transformWords("The 2013 Americans"),
        "The 2013 Americans");
    });

    it("Maintain Mr./Mrs. abbreviations", function(){
      assert.equal(
        videosGet.transformWords("Mr Selfridge"),
        "Mr. Selfridge");

      assert.equal(
        videosGet.transformWords("Mrs Manners"),
        "Mrs. Manners");

      assert.equal(
        videosGet.transformWords("mr Selfridge"),
        "Mr. Selfridge");

      assert.equal(
        videosGet.transformWords("mrs Manners"),
        "Mrs. Manners");
    });
  });

  describe("#getVideoFromFilename(filename):Video", function(){
    beforeEach(function(){
      this.config_videosDir_orig = config.videosDir;
      config.videosDir = "/mock/video/dir";
    });

    afterEach(function(){
      config.videosDir = this.config_videosDir_orig;
    });

    it("parses name, season, and episode information from all an example file listing", function(){
      Object.keys(fixtureVideoFileListings).forEach(function(videoPath){
        var expected = JSON.parse(JSON.stringify(fixtureVideoFileListings[videoPath]));
        expected.file = path.relative(config.videosDir, videoPath);
        assert.deepEqual(
          videosGet.getVideoFromFilename(videoPath),
          expected);
      });
    });

    it("parses video files with no name, season, or episode information", function(){
      assert.deepEqual(videosGet.getVideoFromFilename(config.videosDir+"/blah blah blah.mp4"), {
        file: "blah blah blah.mp4"
      });
    });
  });
});
