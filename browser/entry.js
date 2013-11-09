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
    deps: byId("deps"),
    docs: byId("docs"),
    test: byId("test"),
    login: byId("login"),
    nameSlash: byId("name-slash"),
    demoArrow: byId("demo-arrow"),
    depsArrow: byId("deps-arrow"),
    docsArrow: byId("docs-arrow"),
    testArrow: byId("test-arrow"),
    publishArrow: byId("publish-arrow"),
    nameButton: byId("scroll-to-name"),
    depsButton: byId("scroll-to-deps"),
    demoButton: byId("scroll-to-demo"),
    docsButton: byId("scroll-to-docs"),
    testButton: byId("scroll-to-test"),
    publishButton: byId("publish"),
    loginButton: byId("loginButton"),
    moduleName: byId("moduleName"),
    sourceCode: byId("sourceCode"),
    blackout: byId("blackout")
}

guideSteps = [
  {
    name: "login",
    buttonElement: elems.loginButton,
    element: elems.login,
    onSet: function() {
      
    }
  },
  {
    name: "name",
    buttonElement: elems.nameButton,
    element: elems.name,
    onSet: function() {
      setTimeout(function() {
        elems.moduleName.focus();
      }, 120);
    }
  },
  {
    name: "deps",
    buttonElement: elems.depsButton,
    element: elems.deps
  },
  {
    name: "demo",
    buttonElement: elems.demoButton,
    element: elems.demo
  },
  {
    name: "test",
    buttonElement: elems.testButton,
    element: elems.test
  },
  {
    name: "docs",
    buttonElement: elems.docsButton,
    element: elems.docs
  },
  {
    name: "publish",
    buttonElement: elems.publishButton,
    element: elems.publish
  }
];

function createScrollToCommand(step) {
  step.scrollToCommand = function() {
    scrollTo(step.element.offsetTop-60, elems.scroll, 120, easing.easeInQuad);
    if (step.onSet) {
      step.onSet();
    }
  }
}
function addScrollToCommandsToStep(guideSteps) {
  for (var i = 0; i < guideSteps.length; i++) {
    var step = guideSteps[i];
    createScrollToCommand(step);
  }
}
addScrollToCommandsToStep(guideSteps);


var currentStep = 0;



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

function fadeInElement(elem, delay) {
  setTimeout(function() {
    elem.classList.remove("hidden");
    elem.classList.add("invisible");
    elem.offsetWidth;
    elem.classList.remove("invisible");
  }, delay);
}

function login() {
  
    var githubUsername = "williamcotton";
    elems.loginButton.innerHTML = githubUsername;
    
    elems.loginButton.offsetWidth;
    elems.guide.classList.remove("login");
    elems.guide.classList.add("settled");
    guide.style.marginLeft = "0px";
    guide.style.marginTop = "0px";
    setTimeout(function() {
      document.body.classList.add("loggedIn");
      setTimeout(function() {
        elems.blackout.style.display = "none";
      })
      fadeInElement(elems.nameSlash, 1);
      fadeInElement(elems.nameButton, 20);
      goToNextStep();
      
    }, 500);
    
    var hasFaded = false;
    setTimeout(function() {
      elems.scroll.addEventListener("scroll", function() {
        if (!hasFaded) {
          fadeInTheRest();
          hasFaded = true;
        }
      });
    }, 1200);
    
    document.body.addEventListener("keyup", function(event) {
      if ((event.keyCode == 78 || event.keyCode == 13) && document.body == document.activeElement) {
        goToNextStep();
      }
    });
    
    return;
  
    loginGithub(function(obj) {
        var token = obj.token;
        var github_details = obj.github_details;
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("github_details", JSON.stringify(github_details));
    });
}

elems.scroll.onscroll = function(event) {
    var sections = [elems.login, elems.name, elems.deps, elems.demo, elems.test, elems.docs];
    var currentSelection, i;
    for (i = 0; i < sections.length; i++) {
        var section = sections[i];
        if (elems.scroll.scrollTop > section.offsetTop - 61) {
            currentSelection = section;
        }
    }
    if (currentSelection.id) {
      
        currentStep = getStepNumByName(currentSelection.id);
      
        var buttons = document.querySelectorAll("#guide button");
        for (i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove("active");
        }
        var e = document.querySelector("#guide button." + currentSelection.id);
        
        if (e) {
          e.classList.add("active");
        }
            
    }
}

getStepByName = function(name) {
  var step;
  guideSteps.forEach(function(s,i) {
    if (s.name == name) {
      step = s;
    }
  });
  return step;
}

getStepNumByName = function(name) {
  var num;
  guideSteps.forEach(function(step,i) {
    if (step.name == name) {
      num = i;
    }
  });
  return num;
}

getStepNameByNum = function(num) {
  return guideSteps[num].name;
}

function fadeInTheRest() {
  var elementsToFadeIn = [elems.depsArrow, elems.depsButton, elems.demoArrow, elems.demoButton, elems.testArrow, elems.testButton, elems.docsArrow, elems.docsButton, elems.publishArrow, elems.publishButton];
  for (var i = 0; i < elementsToFadeIn.length; i++) {
    fadeInElement(elementsToFadeIn[i],i*30+300);
  }
}

function submitName() {
  goToNextStep()
  elems.moduleName.blur();
  var name = elems.moduleName.value;
  elems.nameButton.innerHTML = name;
  fadeInTheRest();
  codeModule.name = name;
}

elems.moduleName.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    submitName();
  }
});

function goToNextStep() {
  return goToStep(currentStep + 1);
}

function goToStep(name_or_number) {
  var name, num;
  if (typeof(name_or_number) == "string") {
    name = name_or_number;
    num = getStepNumByName(name);
  }
  else {
    num = name_or_number;
    name = getStepNameByNum(num);
  }
  return guideSteps[num].scrollToCommand();
}

elems.nameButton.addEventListener("click", getStepByName("name").scrollToCommand)
elems.depsButton.addEventListener("click", getStepByName("deps").scrollToCommand)
elems.demoButton.addEventListener("click", getStepByName("demo").scrollToCommand)
elems.docsButton.addEventListener("click", getStepByName("docs").scrollToCommand)
elems.testButton.addEventListener("click", getStepByName("test").scrollToCommand)


require("../js-github/test.js")
