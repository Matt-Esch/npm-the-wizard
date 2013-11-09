var publish = require("./index.js")

var repo = "Raynos/demo-test-test"
var userName = "raynos"

console.log("publishing", repo)

publish(repo, userName, function (err, result) {
    if (err) {
        console.error("err", err)
    }

    console.log("result", result)
})
