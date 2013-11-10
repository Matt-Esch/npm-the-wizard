var document = require("global/document")
var window = require("global/window")
var process = require("process")
var byId = require("by/id")

var easing = require("./lib/easing.js");
var scrollTo = require("./lib/scroll-to");

var publishToRepo = require("./publish.js")
var CodeMirror = require("./lib/code-mirror.js")
var auth = require("./lib/auth.js")
var user = require("./lib/user.js")

var codeModule = {
    name: "my-module",
    metaData: {},
    deps: [],
    sourceCode: "\nmodule.exports = 'my code'\n"
};

var clientId = process.NODE_ENV === "production" ?
    "33a829c575f90153055a" :
    "e58ca5fd53f376b061d2"

var elems = {
    guide: byId("guide"),
    scroll: byId("rightPanel"),
    name: byId("name"),
    demo: byId("demo"),
    deps: byId("deps"),
    docs: byId("docs"),
    test: byId("test"),
    login: byId("login"),
    publish: byId("publish"),
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
    publishButton: byId("publishButton"),
    loginButton: byId("loginButton"),
    moduleName: byId("moduleName"),
    sourceCode: byId("sourceCode"),
    blackout: byId("blackout")
};

window.addEventListener("message", function tokenPostMessage(event) {
    if (!event || !event.data || !event.data.token) {
        return
    }

    var token = event.data.token

    localStorage.setItem("token", token)

    // fetch user credentials
    user(token, function (err, user) {
        if (err) {
            return console.log(err)
        }

        localStorage.setItem("user", JSON.stringify(user))
        afterLogin(user)
    })
}, false)

function afterLogin(user) {
  console.log(user);
    elems.loginButton.innerHTML = user.login || "unknown";

    elems.loginButton.offsetWidth;
    elems.guide.classList.remove("login");
    elems.guide.classList.add("settled");
    guide.style.marginLeft = "0px";
    guide.style.marginTop = "0px";
    setTimeout(function () {

        document.body.classList.add("loggedIn");
        setTimeout(function () {
              elems.blackout.style.display = "none";
        })

        fadeInElement(elems.nameSlash, 1);
        fadeInElement(elems.nameButton, 20);
        goToNextStep();

    }, 500);

    var hasFaded = false;
    setTimeout(function () {
        elems.scroll.addEventListener("scroll", function() {
            if (!hasFaded) {
                fadeInTheRest();
                hasFaded = true;
            }
        });
      }, 1210);

    document.body.addEventListener("keyup", function(event) {
        if ((event.keyCode == 78 || event.keyCode == 13) && document.body == document.activeElement) {
            goToNextStep();
        }
    });
}

var guideSteps = [
  {
    name: "login",
    buttonElement: elems.loginButton,
    element: elems.login,
    onSet: function () {
        auth(clientId)
    }
  },
  {
    name: "name",
    leadingElement: elems.nameSlash,
    buttonElement: elems.nameButton,
    element: elems.name,
    onSet: function() {
      setTimeout(function() {
        elems.moduleName.focus();
      }, 180);
    }
  },
  {
    name: "deps",
    leadingElement: elems.depsArrow,
    buttonElement: elems.depsButton,
    element: elems.deps
  },
  {
    name: "demo",
    leadingElement: elems.demoArrow,
    buttonElement: elems.demoButton,
    element: elems.demo
  },
  {
    name: "test",
    leadingElement: elems.testArrow,
    buttonElement: elems.testButton,
    element: elems.test
  },
  {
    name: "docs",
    leadingElement: elems.docsArrow,
    buttonElement: elems.docsButton,
    element: elems.docs
  },
  {
    name: "publish",
    leadingElement: elems.publishArrow,
    buttonElement: elems.publishButton,
    element: elems.publish,
    onSet: function() {
      publishToRepo(codeModule, function(err, res) {
          if (err) {
              return;
          }
          // didPublishSuccessfully(res);
      });
    }
  }
];

var currentStep = 0;

function createGuideStep(step) {
  step.scrollToCommand = function() {
    scrollTo(step.element.offsetTop-70, elems.scroll, 180, easing.easeInQuad);
    if (step.onSet) {
      step.onSet();
    }
  };
  step.buttonElement.addEventListener("click", step.scrollToCommand);
}

for (var i = 0; i < guideSteps.length; i++) {
  createGuideStep(guideSteps[i]);
}

var mirror = CodeMirror.fromTextArea(elems.sourceCode, {
    value: elems.sourceCode.textContent || "",
    mode: "javascript",
    lineNumbers: true,
    theme: "ambiance"
});
mirror.setSize(window.innerWidth/2, window.innerHeight);
mirror.on("change", sourceCodeChange);
mirror.setValue(codeModule.sourceCode);

window.addEventListener('resize', guideCenterOnResize, true);
function guideCenterOnResize(event) {
  mirror.setSize(window.innerWidth/2, window.innerHeight);
  if (guide.classList.contains("login")) {
    guide.style.marginLeft = -guide.offsetWidth/2 + "px";
    guide.style.marginTop = -guide.offsetHeight/2 + "px";
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

function fadeInElement(elem, delay) {
  setTimeout(function() {
    elem.classList.remove("hidden");
    elem.classList.add("invisible");
    elem.offsetWidth;
    elem.classList.remove("invisible");
  }, delay);
}

elems.scroll.onscroll = function(event) {
    var currentSelection, i;
    for (i = 0; i < guideSteps.length; i++) {
        var section = guideSteps[i].element;
        if (elems.scroll.scrollTop > section.offsetTop - 71) {
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
};

getStepByName = function(name) {
  var step;
  guideSteps.forEach(function(s,i) {
    if (s.name == name) {
      step = s;
    }
  });
  return step;
};

getStepNumByName = function(name) {
  var num;
  guideSteps.forEach(function(step,i) {
    if (step.name == name) {
      num = i;
    }
  });
  return num;
};

getStepNameByNum = function(num) {
  return guideSteps[num].name;
};

function fadeInTheRest() {
  var stepsToFadeIn = guideSteps.slice(2, guideSteps.length);
  var elementsToFadeIn = [];
  stepsToFadeIn.forEach(function(step) {
    elementsToFadeIn.push(step.leadingElement, step.buttonElement);
  });
  for (var i = 0; i < elementsToFadeIn.length; i++) {
    fadeInElement(elementsToFadeIn[i],i*30+300);
  }
}

function submitName() {
  goToNextStep();
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


require("../js-github/test.js");
