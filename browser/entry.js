var document = require("global/document")
var byId = require("by/id")

var easing = require("./lib/easing.js")
var scrollTo = require("./lib/scroll-to")

var publishToRepo = require("./publish.js")
var CodeMirror = require("./lib/code-mirror.js")
//var loginGithub = require("./lib/auth.js")

var codeModule = {
    name: "my-module",
    metaData: {},
    deps: [],
    sourceCode: "module.exports = 'my code'"
}


var Editor = require("./editor.js")

var elems = {
    scroll: byId("rightPanel"),
    name: byId("name"),
    demo: byId("demo"),
    docs: byId("docs"),
    test: byId("test"),
    nameButton: byId("scroll-to-name"),
    demoButton: byId("scroll-to-demo"),
    docsButton: byId("scroll-to-docs"),
    testButton: byId("scroll-to-test"),
    publishButton: byId("publish"),
    loginButton: byId("login"),
    moduleName: byId("moduleName"),
    sourceCode: byId("sourceCode")
}

elems.publishButton.addEventListener("click", publish)
elems.loginButton.addEventListener("click", login)

var mirror = CodeMirror.fromTextArea(elems.sourceCode, {
    value: elems.sourceCode.textContent || "",
    mode: "javascript",
    lineNumbers: true,
    theme: "ambiance"
})

return mirror

mirror.on("change", sourceCodeChange)
mirror.setValue(codeModule.sourceCode)

function moduleNameChange() {
    codeModule.name = elems.moduleName.value;
}

function sourceCodeChange() {
    codeModule.sourceCode = mirror.getValue();
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
  
    var githubUsername = "williamcotton";
    elems.loginButton.innerHTML = githubUsername;
    
    elems.moduleName.focus();
    
    return;
  
    loginGithub(function(obj) {
        var token = obj.token;
        var github_details = obj.github_details;
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("github_details", JSON.stringify(github_details));
    });
}

elems.scroll.onscroll = function(event) {
    var sections = [elems.name, elems.demo, elems.test, elems.docs];
    var currentSelection, i;
    for (i = 0; i < sections.length; i++) {
        var section = sections[i];
        if (elems.scroll.scrollTop > section.offsetTop - 61) {
            currentSelection = section;
        }
    }
    if (currentSelection.id) {
        var buttons = document.querySelectorAll("#menu button");
        for (i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
        }
        document.querySelector("#menu button." + currentSelection.id)
            .classList.add("active");
    }
}

elems.moduleName.focus();

elems.moduleName.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    scrollToDemo();
    var name = elems.moduleName.value;
    elems.nameButton.innerHTML = name;
    codeModule.name = name;
  }
});

elems.nameButton.addEventListener("click", scrollToName)
elems.demoButton.addEventListener("click", scrollToDemo)
elems.docsButton.addEventListener("click", scrollToDocs)
elems.testButton.addEventListener("click", scrollToTest)

function scrollToName() {
    scrollTo(elems.name.offsetTop-60, elems.scroll, 300, easing.easeInQuad);
}

function scrollToDemo() {
    scrollTo(elems.demo.offsetTop-60, elems.scroll, 300, easing.easeInQuad);
}

function scrollToDocs() {
    scrollTo(elems.docs.offsetTop-60, elems.scroll, 300, easing.easeInQuad);
}

function scrollToTest() {
    scrollTo(elems.test.offsetTop-60, elems.scroll, 300, easing.easeInQuad);
}
=======
Scroller(elems)
var mirror = Editor(elems)
Publisher(elems, mirror)
>>>>>>> 82c3a4d71f0c956b03246ae1d04c3b6c9e29039a

require("../js-github/test.js")
