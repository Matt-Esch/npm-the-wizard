var path = require("path")

var config = require("./config.json")
var npmrun = require("./lib/npm-run.js")

var npmConfig = path.join(__dirname, "..", ".npmrc")

module.exports = npmPublish

function npmPublish(folder, userName, callback) {
    ensureUser(function (err, result) {
        if (err) {
            return callback(err)
        }

        callPublish(folder, function (err, result) {
            if (err) {
                return callback(err)
            }

            callback(new Error("not implemented"))
        })
    })
}

// ensure the user is added
function ensureUser(callback) {
    var cmd = npmrun([
        "--userconfig=" + npmConfig,
        "adduser"
    ], callback)

    matchRegex(cmd, /Username:/, function () {
        cmd.stdin.write(config.username + "\n")
    })
    matchRegex(cmd, /Password:/, function () {
        cmd.stdin.write(config.password + "\n")
    })
    matchRegex(cmd, /Email:/, function () {
        cmd.stdin.write(config.email + "\n", function () {
            cmd.stdin.end()
        })
    })
}

function callPublish(folder, callback) {
    var cmd = npmrun([
        "--userconfig=" + npmConfig,
        "publish"
    ], {
        cwd: folder
    }, callback)
}

function changeOwner(folder, userName, callback) {

}

function matchRegex(command, regex, callback) {
    var stdout = ""

    command.stdout.on("data", ondata)

    function ondata(chunk) {
        stdout += String(chunk)
        if (regex.test(stdout)) {
            command.stdout.removeListener("data", ondata)
            callback()
        }
    }
}
