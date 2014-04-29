var assert = require('assert');
var sinon = require('sinon');
var showsGet = require('../src/showsGet');
var videosGet = require('../src/videosGet');

var MOCK_VIDEOS = [
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
]

describe("showsGet.go(request, reply)",function(){
  beforeEach(function(){
    sinon.stub(videosGet, 'go', function(request, reply){ reply(MOCK_VIDEOS) });
  });
  afterEach(function(){
    videosGet.go.restore();
  })

  it("responds with a list of shows with videos for each",function(done){
    showsGet.go(null, function(shows){
      assert.deepEqual(shows, [
        { name: MOCK_VIDEOS[0].show,
          videos: [
            MOCK_VIDEOS[0],
            MOCK_VIDEOS[1]
          ] },
        { name: MOCK_VIDEOS[2].show,
          videos: [
            MOCK_VIDEOS[2]
          ] }
      ]);
      done();
    })
  });
});
