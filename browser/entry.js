// var document = require("global/document")
var byId = require("by/id")

var Editor = require("./editor.js")
var Scroller = require("./scroller.js")
var Publisher = require("./publisher.js")

var elems = {
    scroll: byId("right-panel"),
    demo: byId("demo"),
    docs: byId("docs"),
    test: byId("test"),
    demoButton: byId("scroll-to-demo"),
    docsButton: byId("scroll-to-docs"),
    testButton: byId("scroll-to-test"),
    publishButton: byId("publish")
}

Scroller(elems)
Editor(elems)
Publisher(elems)


window.moduleNameChange = function() {
  codeModule.name = moduleNameElement.value;
}
window.moduleNameChange();

window.sourceCodeChange = function() {
  codeModule.sourceCode = sourceCodeElement.value;
}
window.sourceCodeChange();

var didPublishSuccessfully = function(res) {
  
}

window.login = function() {
  login(function(obj) {
    var token = obj.token;
    var github_details = obj.github_details;
    localStorage.setItem("token", JSON.stringify(token));
    localStorage.setItem("github_details", JSON.stringify(github_details));
  });
}

require("../js-github/test.js")
