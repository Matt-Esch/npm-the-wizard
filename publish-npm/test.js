var publish = require("./index.js")

var repo = "Raynos/routes-router"
var userName = "raynos"

console.log("publishing", repo)

publish(repo, userName, function (err, result) {
    if (err) {
        console.error("err", err)
    }

    console.log("result", result)
})
