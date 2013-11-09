var sendError = require("send-data/error")
var sendJson = require("send-data/json")
var auth = require("./lib/github-auth.js")(require("./config/github-auth.json"))

module.exports = github

function github(req, res, opts) {
    var code = opts.code

    auth(code, function (err, token) {
        if (err || !token) {
            return sendError(req, res, {"error": "bad_code"})
        }

        sendJson(req, res, { "token": token })
    })
}
