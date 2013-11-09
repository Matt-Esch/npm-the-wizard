var xhr = require("xhr")

module.exports = publishModule

/*  publishModule := ({
        name: String,
        metaData: Object,
        deps: Array,
        sourceCode: String
    })

*/
function publishModule(module, callback) {
    getGithubUser(function (err, userName) {
        if (err) {
            return callback(err)
        }

        module.metaData.githubUserName = userName
        module.metaData.githubFragment = userName + "/" + module.name

        githubPublish(module, function (err) {
            if (err) {
                return callback(err)
            }

            npmPublish(module, callback)
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
    callback(null)
}

// implement real thing
function getGithubUser(callback) {
    callback(null, "Raynos")
}
