# Inspired by: http://stackoverflow.com/questions/4360060/video-streaming-with-html-5-via-node-js
# https://gist.github.com/paolorossi/1993068
http = require 'http'
fs   = require 'fs'

printUsageAndExit = (errMsg)->
  console.log "ERROR: #{errMsg}" if errMsg
  console.log 'USAGE: server.coffee [path to video]'
  process.exit()

unless path = process.argv[2]
  printUsageAndExit 'no [path to video]'
  
unless fs.existsSync path
  printUsageAndExit "#{path} doesn't exists"

videoSize = fs.statSync(path).size

server = http.createServer (req, res)->
  if range = req.headers.range
    [partialstart, partialend] = range.replace(/bytes=/, '').split('-')
    start = parseInt partialstart, 10
    end =
      if partialend then parseInt partialend, 10
      else videoSize-1
    chunksize = (end-start)+1
    console.log "RANGE: #{start} - #{end} = #{chunksize}"
 
    file = fs.createReadStream path, {start,end}
    res.writeHead 206, 
      'Content-Type': 'video/mp4'
      'Content-Range': "bytes #{start}-#{end}/#{videoSize}"
      'Accept-Ranges': 'bytes'
      'Content-Length': chunksize
    file.pipe res

  else
    console.log "ALL: #{videoSize}"
    res.writeHead 200,
      'Content-Length': videoSize
      'Content-Type': 'video/mp4'
    fs.createReadStream(path).pipe(res)

server.listen 1337
console.log 'Server running at http://127.0.0.1:1337/'