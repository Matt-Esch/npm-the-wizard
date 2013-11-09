var sendError = require("send-data/error")
var sendJson = require("send-data/json")
var jsonBody = require("body/json")

var publish = require("./publish-npm")

module.exports = publishRoute

/*
    POST /publish {
        userName: "raynos",
        github: "Raynos/after"
    }
*/
function publishRoute(req, res) {
    if (req.method !== "POST") {
        res.statusCode = 405
        return res.end("Method not allowed")
    }

    jsonBody(req, res, function (err, body) {
        if (err) {
            return sendError(req, res, err)
        }

        body = body || {}

        var github = body.github
        var userName = body.userName

        if (typeof github !== "string" || typeof userName !== "string") {
            return sendError(req, res, new Error("invalid body"))
        }

        publish(body.github, body.userName, function (err, res) {
            if (err) {
                return sendError(req, res, err)
            }

            sendJson(req, res, {
                code: 200,
                message: "ok"
            })
        })
    })
}
