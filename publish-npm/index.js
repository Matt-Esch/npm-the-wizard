var uuid = require("uuid")
var path = require("path")

var checkNamespace = require("./check-namespace.js")
var cloneLocally = require("./clone-locally.js")
var npmPublish = require("./npm-publish.js")

module.exports = publish

// publishNpm('Raynos/foobar', function (err) {})
function publish(githubUri, npmUserName, callback) {
    var id = uuid()
    var folder = path.join(__dirname, "modules", id)
    var parts = githubUri.split("/")
    var moduleName = parts[1]

    checkNamespace(moduleName, function (err) {
        if (err) {
            return callback(err)
        }

        cloneLocally(githubUri, folder, function (err) {
            if (err) {
                return callback(err)
            }

            var tuple = githubUri.split("/")
            var gitFolder = path.join(folder, tuple[1])

            npmPublish(gitFolder, npmUserName, callback)
        })
    })
}
