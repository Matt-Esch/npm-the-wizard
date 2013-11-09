var Router = require("routes-router")
var ServeBrowserify = require("serve-browserify")
var path = require("path")
var st = require("st")
// var fs = require("fs")
// var sendHtml = require("send-data/html")

var auth = require("./routes/auth.js")
// var indexHtml = fs.readFileSync(path.join(__dirname, "static", "index.html"))

var router = Router()

router.addRoute("/", function (req, res) {
    req.url = "/static/index.html"
    mount(req, res)
})

router.addRoute("/auth", auth)

var mount = st({
    path: path.join(__dirname, "static"),
    cache: false,
    url: "/static"
})

router.addRoute("/static/*", mount)

router.addRoute("/entry.js", function (req, res) {
    ServeBrowserify({
        root: path.join(__dirname, "browser")
    })(req, res)
})

router.addRoute("/publish", require("./routes/publish.js"))

module.exports = router
