var assert = require('assert');
var fs = require('fs');
var sinon = require('sinon');

var fixtureVideoFileListings = require('../spec-fixtures/video-file-listings');
var videosGet = require('../src/videosGet');

describe("videosGet.normalizeNameDelimiter(showName):string",function(){
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

describe("videosGet.transformWords(normalizedShowName):string",function(){
  it("Capitalize the first letter of each word", function(){
    assert.equal(
      videosGet.transformWords("the walking dead"),
      "The Walking Dead"
    );
  });

  describe("except when the middle word is...",function(){
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

describe("videosGet.getVideoFromFilename(filename):Video",function(){
  it("parses all examples from fixture video file listings", function(){
    Object.keys(fixtureVideoFileListings).forEach(function(path){
      var expected = JSON.parse(JSON.stringify(fixtureVideoFileListings[path]));
      expected.file = path;
      assert.deepEqual(videosGet.getVideoFromFilename(path), expected);
    });
  });
});

describe("videosGet.go(request:object, reply:function)",function(){
  beforeEach(function(){
    sinon.stub(fs, 'readdir', function(path, cb){ cb(undefined, MOCK_FILES) });
  });
  afterEach(function(){
    fs.readdir.restore();
  })

  xit("responds with a list of videos",function(done){
    videosGet.go(null, function(videos){
      assert.deepEqual(videos, [
        {
          "show": "Hannibal",
          "season": 2,
          "episode": 1,
          "file": "[eztv]HannibalS02E01/[eztv]HannibalS02E01.mp4"
        },
        {
          "show": "Hannibal",
          "season": 2,
          "episode": 2,
          "file": "[eztv]HannibalS02E02/[eztv]HannibalS02E02.mp4"
        },
        {
          "show": "Mr. Selfridge",
          "season": 3,
          "episode": 1,
          "file": "[eztv]Mr. SelfridgeS03E01/[eztv]Mr. SelfridgeS03E01.mp4"
        }
      ]);
      done();
    })
  });
});
