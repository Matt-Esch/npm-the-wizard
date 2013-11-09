var publishToRepo = require("./publish.js")

var codeModule = {
    name: "my-module",
    metaData: {},
    deps: [],
    sourceCode: "module.exports = 'my code'"
}

module.exports = Publisher

function Publisher(elems) {
    elems.publish.addEventListener("click", publish)

    function publish() {
        publishToRepo(codeModule, function(err, res) {
            if (err) {
                return;
            }
            // didPublishSuccessfully(res);
        })
    }
}

