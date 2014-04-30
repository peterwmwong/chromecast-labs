// Inspired by: http://stackoverflow.com/questions/4360060/video-streaming-with-html-5-via-node-js
// https://gist.github.com/paolorossi/1993068
http   = require('http');
fs     = require('fs');
// config = 

function printUsageAndExit(errMsg){
  if(errMsg)
    console.log("ERROR:",errMsg);
  console.log("USAGE: server.coffee [path to video]");
  process.exit();
}

// Verify required path
var path = process.argv[2];
if(!path)
  printUsageAndExit("no [path to video]");


// Verify required path exists
if(!fs.existsSync(path))
  printUsageAndExit(path+" doesn't exists");


// Cache video file size
var videoSize = fs.statSync(path).size;

http.createServer(function(req, res){
  var range = req.headers.range;
  if(range){
    var byteRangeParts = range.replace(/bytes=/, '').split('-');
    var partialstart = byteRangeParts[0];
    var partialend = byteRangeParts[1];

    var start = parseInt(partialstart, 10);
    var end = (partialend) ? parseInt(partialend, 10) : videoSize-1;
    var chunksize = (end-start)+1;
    console.log("RANGE:",start,"-",end,"=",chunksize);

    res.writeHead(206, {
      'Content-Type': 'video/mp4',
      'Content-Range': "bytes "+start+"-"+end+"/"+videoSize,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize
    });
    fs.createReadStream(path, {start:start, end:end}).pipe(res);

  }else{
    console.log("ALL:", videoSize);
    res.writeHead(200, {
      'Content-Length': videoSize,
      'Content-Type': 'video/mp4'
    });
    fs.createReadStream(path).pipe(res);
  }
}).listen(1337);

console.log('Server running at http://127.0.0.1:1337/');
