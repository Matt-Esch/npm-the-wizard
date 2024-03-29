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

            changeOwner(folder, userName, callback)
        })
    })
}

// ensure the user is added
function ensureUser(callback) {
    console.log("npmConfig", npmConfig)
    var cmd = npmrun([
        "--userconfig=" + npmConfig,
        "adduser"
    ], callback)

    matchRegex(cmd, /Username:/, function () {
        console.log("wrote Username", config.username)
        cmd.stdin.write(config.username + "\n")
    })
    matchRegex(cmd, /Password:/, function () {
        console.log("wrote password", config.password)
        cmd.stdin.write(config.password + "\n")
    })
    matchRegex(cmd, /Email:/, function () {
        console.log("wrote email", config.email)
        cmd.stdin.write(config.email + "\n", function () {
            cmd.stdin.end()
        })
    })
}

function callPublish(folder, callback) {
    console.log("npmConfig", npmConfig, folder)
    npmrun([
        "--userconfig=" + npmConfig,
        "publish"
    ], {
        cwd: folder
    }, callback)
}

function changeOwner(folder, userName, callback) {
    var packageName = path.basename(folder)

    npmrun([
        "--userconfig=" + npmConfig,
        "owner",
        "add",
        userName,
        packageName
    ], { cwd: folder }, function (err) {
        if (err) {
            return callback(err)
        }

        npmrun([
            "--userconfig=" + npmConfig,
            "owner",
            "rm",
            config.username,
            packageName
        ], { cwd: folder }, callback)
    })
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
