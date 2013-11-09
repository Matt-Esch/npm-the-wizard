var Router = require("routes-router")
var ServeBrowserify = require("serve-browserify")
var path = require("path")
var st = require("st")
var fs = require("fs")
var sendHtml = require("send-data/html")

var auth = require("./routes/auth.js")
var indexHtml = fs.readFileSync(path.join(__dirname, "static", "index.html"))

var router = Router()

router.addRoute("/", function (req, res) {
    sendHtml(req, res, indexHtml)


    // http://blog.nodeknockout.com/post/35364532732/protip-add-the-vote-ko-badge-to-your-app
    var voteko = "<iframe src='http://nodeknockout.com/iframe/team-mad-science' frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>"

    res.writeHead(200, { "Content-Type": "text/html" })
    res.end("<html><body>" + voteko + "<script src='entry.js'></script></body></html>\n")
})

router.addRoute("/auth/:code", auth)

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
