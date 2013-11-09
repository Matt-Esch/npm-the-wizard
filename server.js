require("nko")("4spqyBaFzk4ZQI-y")

var http = require("http")
var fs = require("fs")
var process = require("process")
var router = require("./router.js")


function corsHeaders(req, res) {
  var host;
  if (req.headers.referer) {
    var parsed_url = url.parse(req.headers.referer);
    host = parsed_url.protocol + "//" + parsed_url.host;
  }
  else {
    host = "*";
  }
  res.setHeader('Access-Control-Allow-Origin', host);
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

var isProduction = process.env.NODE_ENV === "production"
var port = isProduction ? 80 : 8000

var server = http.createServer(function (req, res) {
  corsHeaders(req, res)
  router(req, res)
})

server.listen(port, function (err) {
    if (err) {
        console.error(err)
        process.exit(-1)
    }

    if (process.getuid() === 0) {
        fs.stat(__filename, function (err, stat) {
            if (err) {
                return console.error(err)
            }
            process.setuid(stat.uid)
        })
    }

    console.log("Server running at http://localhost:" + port + "/")
})
