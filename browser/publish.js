var xhr = require("xhr")
var jsGithubPublish = require('../js-github/publish.js');

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

        module.metaData.githubUserName = user.name
        module.metaData.githubEmail = user.email
        module.metaData.githubFragment = user.name + "/" + module.name

        createFiles(module, function (err, files) {
            if (err) {
                return callback(err)
            }

            console.log("files", files)

            files["index.js"] = module.sourceCode

            module.metaData.gitRepoFiles = files

            githubPublish(module, function (err) {
                if (err) {
                    return callback(err)
                }

                // npmPublish(module, callback)
                callback(null, { code: 200, message: "ok" })
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
function githubPublish(module, callback) {
    var meta = module.metaData;
    var root = meta.githubFragment;
    var user = { name: meta.githubUserName, email: meta.githubEmail };
    var files = meta.gitRepoFiles;
    jsGithubPublish(root, user, files, callback);
}

// implement real thing
function getGithubUser(callback) {
    callback(null, { name: "Raynos", email: "raynos2@gmail.com" })
    // callback(null, JSON.parse(localStorage.getItem("github_details")))
}
