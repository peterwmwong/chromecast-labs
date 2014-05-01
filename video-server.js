var http   = require('http');
var fs     = require('fs');
var path   = require('path');

var server = null;
module.exports = {
  start: function(videoDirPath){
    // Validate server isn't already started and required path specified and
    // exists
    if(!server && videoDirPath && fs.existsSync(videoDirPath)){
      server = http.createServer(function(req, res){
        var videoPath = path.join(videoDirPath, '.'+req.url);

        if(fs.existsSync(videoPath)){
          var videoSize = fs.statSync(videoPath).size;
          var range = req.headers.range;

          if(range){
            var byteRangeParts = range.replace(/bytes=/, '').split('-');
            var start = +byteRangeParts[0];
            var end = (byteRangeParts[1]) ? +byteRangeParts[1] : videoSize-1;
            var chunksize = end-start+1;

            console.log("RANGE:",start,"-",end,"=",chunksize);

            res.writeHead(206, {
              'Content-Type': 'video/mp4',
              'Content-Range': "bytes "+start+"-"+end+"/"+videoSize,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize
            });
            fs.createReadStream(videoPath, {start:start, end:end}).pipe(res);

          }else{
            console.log("ALL:", videoSize);

            res.writeHead(200, {
              'Content-Length': videoSize,
              'Content-Type': 'video/mp4'
            });
            fs.createReadStream(videoPath).pipe(res);
          }
        }
      })

      server.listen(1337);
    }
  }
};
