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

window.auth = require("./lib/auth.js")

var elems = {
    guide: byId("guide"),
    scroll: byId("rightPanel"),
    name: byId("name"),
    demo: byId("demo"),
    docs: byId("docs"),
    test: byId("test"),
    login: byId("login"),
    demoArrow: byId("demo-arrow"),
    docsArrow: byId("docs-arrow"),
    testArrow: byId("test-arrow"),
    publishArrow: byId("publish-arrow"),
    nameButton: byId("scroll-to-name"),
    demoButton: byId("scroll-to-demo"),
    docsButton: byId("scroll-to-docs"),
    testButton: byId("scroll-to-test"),
    publishButton: byId("publish"),
    loginButton: byId("loginButton"),
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
mirror.setSize(window.innerWidth/2, window.innerHeight);
mirror.on("change", sourceCodeChange)
mirror.setValue(codeModule.sourceCode)

window.addEventListener('resize', guideCenterOnResize, true);
function guideCenterOnResize(event) {
  mirror.setSize(window.innerWidth/2, window.innerHeight);
  if (guide.classList.contains("login")) {
    guide.style.marginLeft = -guide.offsetWidth/2 + "px"
    guide.style.marginTop = -guide.offsetHeight/2 + "px"
    guide.classList.remove("deactivated");
    guide.classList.add("activated");
  }
}
guideCenterOnResize();

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
    elems.loginButton.offsetWidth;
    elems.guide.classList.remove("login");
    elems.guide.classList.add("settled");
    guide.style.marginLeft = "0px";
    guide.style.marginTop = "0px";
    elems.loginButton.innerHTML = githubUsername;
    
    setTimeout(function() {
      scrollToName();
    }, 500);
    
    
    return;
  
    loginGithub(function(obj) {
        var token = obj.token;
        var github_details = obj.github_details;
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("github_details", JSON.stringify(github_details));
    });
}

elems.scroll.onscroll = function(event) {
    var sections = [elems.login, elems.name, elems.demo, elems.test, elems.docs];
    var currentSelection, i;
    for (i = 0; i < sections.length; i++) {
        var section = sections[i];
        if (elems.scroll.scrollTop > section.offsetTop - 61) {
            currentSelection = section;
        }
    }
    if (currentSelection.id) {
        var buttons = document.querySelectorAll("#guide button");
        for (i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
        }
        console.log(currentSelection.id);
        var e = document.querySelector("#guide button." + currentSelection.id);
        
        if (e) {
          e.classList.add("active");
        }
            
    }
}

elems.moduleName.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    scrollToDemo();
    
    var name = elems.moduleName.value;
    elems.nameButton.innerHTML = name;
    
    var hiddenElems = elems.guide.querySelectorAll(".hidden");
    
    // for (var i = 0; i < hiddenElems.length; i++) {
    //   var h = hiddenElems[i];
    //   h.classList.remove("hidden");
    //   h.classList.add("invisible");
    //   h.offsetWidth;
    //   h.classList.remove("invisible");
    // }
    
    function fadeInElement(elem, delay) {
      setTimeout(function() {
        elem.classList.remove("hidden");
        elem.classList.add("invisible");
        elem.offsetWidth;
        elem.classList.remove("invisible");
      }, delay);
    }
    
    var elementsToFadeIn = [elems.demoArrow, elems.demoButton, elems.testArrow, elems.testButton, elems.docsArrow, elems.docsButton, elems.publishArrow, elems.publishButton];
    
    for (var i = 0; i < elementsToFadeIn.length; i++) {
      fadeInElement(elementsToFadeIn[i],i*30+300);
    }
    
    codeModule.name = name;
  }
});

elems.nameButton.addEventListener("click", scrollToName)
elems.demoButton.addEventListener("click", scrollToDemo)
elems.docsButton.addEventListener("click", scrollToDocs)
elems.testButton.addEventListener("click", scrollToTest)

function scrollToName() {
    scrollTo(elems.name.offsetTop-60, elems.scroll, 120, easing.easeInQuad);
    setTimeout(function() {
      elems.moduleName.focus();
    }, 120);
}

function scrollToDemo() {
    scrollTo(elems.demo.offsetTop-60, elems.scroll, 120, easing.easeInQuad);
}

function scrollToDocs() {
    scrollTo(elems.docs.offsetTop-60, elems.scroll, 120, easing.easeInQuad);
}

function scrollToTest() {
    scrollTo(elems.test.offsetTop-60, elems.scroll, 120, easing.easeInQuad);
}


require("../js-github/test.js")
