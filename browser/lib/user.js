var xhr = require("xhr")

module.exports = user

function user(token, cb) {
    xhr({
        uri: "https://api.github.com/user",
        json: {
            token: token
        }
    }, function(err, resp, body) {
        if (err) {
            return cb(err)
        }

        cb(null, body)
    })
}