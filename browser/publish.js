var xhr = require("xhr")

var createFiles = require("./create-files")

module.exports = publishModule

/*  publishModule := ({
        name: String,
        metaData: Object,
        deps: Array,
        sourceCode: String
    })

*/
function publishModule(module, callback) {
    getGithubUser(function (err, user) {
        if (err) {
            return callback(err)
        }

        module.metaData.githubUserName = user.login
        module.metaData.githubEmail = user.email
        module.metaData.githubFragment = user.login + "/" + module.name

        createFiles(module, function (err, files) {
            if (err) {
                return callback(err)
            }

            // console.log("files", files)

            files["index.js"] = module.sourceCode

            module.metaData.gitRepoFiles = files

            githubPublish(module, function (err) {
                if (err) {
                    return callback(err)
                }

                console.log("module", module)
                npmPublish(module, callback)
                // callback(null, { code: 200, message: "ok" })
            })
        })
    })
}

function npmPublish(module, callback) {
    xhr({
        uri: "/publish",
        method: "POST",
        json: {
            userName: module.metaData.npmUserName,
            github: module.metaData.githubFragment
        }
    }, function (err, res) {
        if (err) {
            return callback(err)
        }

        callback(null, res.body)
    })
}

// @creationix implement thing here
var githubPublish = require('../js-github/publish.js');

// implement real thing
function getGithubUser(callback) {
    //callback(null, { name: "Raynos", email: "raynos2@gmail.com" })
    callback(null, JSON.parse(localStorage.getItem("user")))
}
