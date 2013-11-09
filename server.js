require("nko")("4spqyBaFzk4ZQI-y")

var http = require("http")
var fs = require("fs")
var process = require("process")
var router = require("./router.js")

var isProduction = process.env.NODE_ENV === "production"
var port = isProduction ? 80 : 8000

var server = http.createServer(router)
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
