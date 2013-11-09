var template = require("string-template")
var sendError = require("send-data/error")
var sendHtml = require("send-data/html")
var config = require("../config/github-auth.json")
var auth = require("../lib/github-auth.js")(config)

var script = "<!doctype html>"
script += "<meta-charset='utf-8'>"
script += "<title>User Auth</title>"
script += "<script type='text/javascript'>"
script += "var data = {data};"
script += "window.opener.postMessage(data, window.location);"
script += "window.close();"
script += "</script>"

module.exports = github

function github(req, res, opts) {
    var code = opts.code

    if (!code) {
        return sendError(req, res, { "error": "bad_code" })
    }

    auth(code, function (err, token) {
        if (err || !token) {
            return sendError(req, res, {"error": "bad_code"})
        }

        var userData = {
            token: token
        }

        sendHtml(req, res, template(script, {
            data: JSON.stringify(userData)
        }))
    })
}
