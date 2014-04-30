var path = require('path');
var cp = require('child_process');
var config = require('../../config/config.json');

module.exports = {

  wordTransforms: [
    function mrMrsWordTransform(word, i, numWords){
      return (/mrs?/.test(word.toLowerCase())) ? word+'.' : word;
    },

    function capitalizeName(word, i, numWords){
      return (i === 0 || !/the|with|to|of/.test(word))
                ? word[0].toUpperCase() + word.slice(1)
                : word
    },

    function removeYearLastWord(word, i, numWords){
      return (i+1 === numWords && /(20|19)\d\d/.test(word)) ? '' : word;
    }
  ],

  normalizeNameDelimiter: function(name){
    return name.replace(/\./g,' ');
  },

  transformWords: function(name){
    return name.split(' ').map((function(word, i, wordArray){
      var numWords = wordArray.length;
      return this.wordTransforms.reduce(function(curWord, transform, j){
        return transform(curWord, i, numWords);
      }, word);
    }).bind(this)).join(' ');
  },

  getVideoFromFilename: function(videoPath){
    var filename = path.basename(videoPath);
    var parentDirname = path.basename(path.dirname(videoPath));
    var match, result;

    if(match = /(.*?)[\. ]?[Ss](\d+)[Ee](\d+).*\.mp4$/.exec(filename)) {
      result = {
        show: match[1],
        season: +match[2],
        episode: +match[3],
        file: videoPath
      };
    } else if(match = /(.*?)\.(\d+)[xX](\d+).*\.mp4$/.exec(filename)) {
      result = {
        show: match[1],
        season: +match[2],
        episode: +match[3],
        file: videoPath
      };
    } else if(match = /(.*?) - .*\.mp4$/.exec(filename)) {
      result = {
        show: match[1],
        file: videoPath
      };
    } else if(match = /^(.*?) [Ss](\d+)[Ee](\d+)/.exec(parentDirname)) {
      result = {
        show: match[1],
        season: +match[2],
        episode: +match[3],
        file: videoPath
      };
    }

    if(result)
      result.show = this.transformWords(
                      this.normalizeNameDelimiter(
                        result.show)).trim();
    else
      result = {file: videoPath};

    return result;
  },

  go: function(req, reply){
    var getVideoFromFilename = this.getVideoFromFilename.bind(this);
    cp.exec('find '+config.videosDir+' -name "*.mp4"', function(error, stdout, stderr){
      if(error)
        reply(Hapi.error.badRequest('Error finding videos'));
      else
        reply(stdout.split('\n').reduce(function(acc, videoPath){
          var video = getVideoFromFilename(videoPath);
          if(video) acc.push(video);
          return acc;
        },[]));
    });
  }
};
