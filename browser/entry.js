var document = require("global/document")
var window = require("global/window")

var easing = require("./lib/easing.js")
var scrollTo = require("./lib/scroll-to")
var publishToRepo = require("./publish.js")

var codeModule = {
  name: "my-module",
  metaData: {},
  deps: [],
  sourceCode: "module.exports = 'my code'"
}

var scrollElement = document.getElementById("right-panel");
var demoElement = document.getElementById("demo");
var docsElement = document.getElementById("docs");
var testElement = document.getElementById("test");

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

window.scrollToDemo = function() {
  scrollTo(demoElement.offsetTop-20, scrollElement, 300, easing.easeInQuad);
}

window.scrollToDocs = function() {
  scrollTo(docsElement.offsetTop-20, scrollElement, 300, easing.easeInQuad);
}

window.scrollToTest = function() {
  scrollTo(testElement.offsetTop-20, scrollElement, 300, easing.easeInQuad);
}

var didPublishSuccessfully = function(res) {
  
}

window.publish = function() {
  publishToRepo(codeModule, function(err, res) {
    if (err) {
      return;
    }
    didPublishSuccessfully(res);
  });
}

require("../js-github/test.js")
