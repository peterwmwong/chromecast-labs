var allVideos = [
  {
    "show": "Hannibal",
    "season": 2,
    "episode": 2,
    "file": "[eztv]HannibalS02E02/[eztv]HannibalS02E02.mp4"
  },
  {
    "show": "Hannibal",
    "season": 2,
    "episode": 1,
    "file": "[eztv]HannibalS02E01/[eztv]HannibalS02E01.mp4"
  },
  {
    "show": "Hannibal",
    "season": 2,
    "episode": 3,
    "file": "[eztv]HannibalS02E03.mp4"
  },

  {
    "show": "Mr. Selfridge",
    "season": 2,
    "episode": 1,
    "file": "[eztv]Mr. SelfridgeS02E01/[eztv]Mr. SelfridgeS02E01.mp4"
  },
  {
    "show": "Mr. Selfridge",
    "season": 2,
    "episode": 2,
    "file": "[eztv]Mr. SelfridgeS02E02/[eztv]Mr. SelfridgeS02E02.mp4"
  },
  {
    "show": "Mr. Selfridge",
    "season": 2,
    "episode": 3,
    "file": "[eztv]Mr. SelfridgeS02E03.mp4"
  },

  {
    "show": "True Detective",
    "season": 1,
    "episode": 1,
    "file": "[eztv]True DetectiveS01E01/[eztv]True DetectiveS01E01.mp4"
  },
  {
    "show": "True Detective",
    "season": 1,
    "episode": 2,
    "file": "[eztv]True DetectiveS01E02/[eztv]True DetectiveS01E02.mp4"
  },
  {
    "show": "True Detective",
    "season": 1,
    "episode": 3,
    "file": "[eztv]True DetectiveS01E03.mp4"
  },
  {
    "show": "True Detective",
    "season": 1,
    "episode": 4,
    "file": "[eztv]True DetectiveS01E04.mp4"
  }
];

module.exports = function(req,reply){ reply(allVideos) };
