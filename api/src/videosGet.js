var fs = require('fs');
var path = require('path');

module.exports = {

  wordTransforms: [
    function mrMrsWordTransform(word, i, numWords){
      return (/mrs?/.test(word.toLowerCase())) ? word+'.' : word;
    },

    function capitalizeName(word, i, numWords){
      return (i !== 0 && /the|with|to|of/.test(word))
                ? word
                : word[0].toUpperCase() + word.slice(1);
    },

    function removeYearLastWord(word, i, numWords){
      return (/(20|19)\d\d/.test(word)) ? '' : word;
    }
  ],

  normalizeNameDelimiter: function(name){
    return name.replace(/\./g,' ');
  },

  transformWords: function(name){
    var wordTransforms = this.wordTransforms;
    return name.split(' ').map(function(word, i, wordArray){
      var numWords = wordArray.length;
      return wordTransforms.reduce(function(curWord,transform, j){
        return transform(curWord, i, numWords);
      },word);
    }).join(' ');
  },

  getVideoFromFilename: function(videoPath){
    var filename = path.basename(videoPath);
    var parentDirname = path.basename(path.dirname(videoPath));
    var match, result;

    if(match = /(.*?)[\. ]?[Ss](\d+)[Ee](\d+).*\.mp4$/.exec(filename)) {
      result = {
        name: match[1],
        season: +match[2],
        episode: +match[3],
        file: videoPath
      };
    } else if(match = /(.*?)\.(\d+)[xX](\d+).*\.mp4$/.exec(filename)) {
      result = {
        name: match[1],
        season: +match[2],
        episode: +match[3],
        file: videoPath
      };
    } else if(match = /^(.*?) [Ss](\d+)[Ee](\d+)/.exec(parentDirname)) {
      result = {
        name: match[1],
        season: +match[2],
        episode: +match[3],
        file: videoPath
      };
    }

    if(result){
      result.name = this.transformWords(
                      this.normalizeNameDelimiter(
                        result.name)).trim();
      return result;
    }
  },
  go: function(req, reply){
    fs.readdir(__dirname+'../videos',function(err, files){
      reply(files.reduce(function(acc, file){
        acc.push({
          "show": "True Detective",
          "season": 1,
          "episode": 4,
          "file": file
        });
        return acc;
      },[]));
    });
  }
};
