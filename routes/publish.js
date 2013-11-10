var sendError = require("send-data/error")
var sendJson = require("send-data/json")
var path = require("path")
var jsonBody = require("body/json")
var exec = require("child_process").exec

var publishFile = path.join(__dirname, "..", "publish-npm", "spawn.js")
// var publish = require("../publish-npm")

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

        body.userName = body.userName.toLowerCase()
        body.userName = body.userName.trim()
        body.github = body.github.trim()
        console.log("publishing", body.github, body.userName)
        exec("node " + publishFile + " " + body.github + " " + body.userName,
            function (error, stdout, stderr) {
                if (err) {
                    return sendError(req, res, err)
                }

                console.log("stdout", stdout)
                console.log("stderr", stderr)

                sendJson(req, res, {
                    code: 200,
                    message: "ok"
                })
            })

        // publish(body.github, body.userName, function (err, resp) {
        //     if (err) {
        //         return sendError(req, res, err)
        //     }

        //     sendJson(req, res, {
        //         code: 200,
        //         message: "ok"
        //     })
        // })
    })
}
