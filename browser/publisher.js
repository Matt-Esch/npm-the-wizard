var publishToRepo = require("./publish.js")
//var loginGithub = require("./lib/auth.js")

var codeModule = {
    name: "my-module",
    metaData: {},
    deps: [],
    sourceCode: "module.exports = 'my code'"
}

module.exports = Publisher

function Publisher(elems) {
    elems.publishButton.addEventListener("click", publish)
    elems.loginButton.addEventListener("click", login)
    elems.moduleName.addEventListener("keyup", moduleNameChange)
    elems.sourceCode.addEventListener("keyup", sourceCodeChange)

    function moduleNameChange() {
        codeModule.name = elems.moduleName.value;
    }

    function sourceCodeChange() {
        codeModule.sourceCode = elems.sourceCode.value;
    }

    function publish() {
        publishToRepo(codeModule, function(err, res) {
            if (err) {
                return;
            }
            // didPublishSuccessfully(res);
        })
    }

    function login() {
        loginGithub(function(obj) {
            var token = obj.token;
            var github_details = obj.github_details;
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("github_details", JSON.stringify(github_details));
        });
    }
}

