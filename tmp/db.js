var dat = require('dat-core')
var leveljs = require('level-js')

var db = dat({
  backend: leveljs
})

db.put('test', 'ok', function (err) {
  db.createReadStream()
    .on('data', console.log)
    .on('end', console.log)
})