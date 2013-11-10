var request = require("request")

module.exports = checkNamespace

function checkNamespace(moduleName, callback) {
    request("https://npmjs.org/package/" + moduleName, function (err, res) {
        // console.log("wtf", res.statusCode)
        if (err) {
            return callback(err)
        } else if (res && res.statusCode === 200) {
            return callback(new Error("name: " + moduleName +
                " is taken on npm"))
        }

        callback()
    })
}
