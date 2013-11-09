var sendError = require("send-data/error")
var sendJson = require("send-data/json")
var config = require("../config/github-auth.json")
var auth = require("../lib/github-auth.js")(config)

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
