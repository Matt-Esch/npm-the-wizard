var document = require("global/document")
var byId = require("by/id")

var easing = require("./lib/easing.js")
var scrollTo = require("./lib/scroll-to")
var publishToRepo = require("./publish.js")
var login = require("./lib/auth.js")

var codeModule = {
  name: "my-module",
  metaData: {},
  deps: [],
  sourceCode: "module.exports = 'my code'"
}

var scrollElement = byId("rightPanel");
var demoElement = byId("demo");
var docsElement = byId("docs");
var testElement = byId("test");
var demoButton = byId("scroll-to-demo")
var docsButton = byId("scroll-to-docs")
var testButton = byId("scroll-to-test")
var publishButton = byId("publish")

scrollElement.onscroll = function(event) {
  var sections = [demoElement, docsElement, testElement];
  var currentSelection, i;
  for (i = 0; i < sections.length; i++) {
    var section = sections[i];
    if (scrollElement.scrollTop > section.offsetTop - 21) {
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

demoButton.addEventListener("click", scrollToDemo)
docsButton.addEventListener("click", scrollToDocs)
testButton.addEventListener("click", scrollToTest)
publishButton.addEventListener("click", publish)

function scrollToDemo() {
  scrollTo(demoElement.offsetTop-20, scrollElement, 300, easing.easeInQuad);
}

function scrollToDocs() {
  scrollTo(docsElement.offsetTop-20, scrollElement, 300, easing.easeInQuad);
}

function scrollToTest() {
  scrollTo(testElement.offsetTop-20, scrollElement, 300, easing.easeInQuad);
}

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

window.publish = function() {
  publishToRepo(codeModule, function(err, res) {
    if (err) {
      return;
    }
    // didPublishSuccessfully(res);
  });
}

require("../js-github/test.js")
