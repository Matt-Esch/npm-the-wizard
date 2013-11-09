var latest = require("latest")

module.exports = checkNamespace

function checkNamespace(moduleName, callback) {
    latest(moduleName, function (err) {
        if (err) {
            return callback()
        }

        callback(new Error("name: " + moduleName +
            " is taken on npm"))
    })
}
