var document = require("global/document")
var window = require("global/window")
var process = require("process")
var byId = require("by/id")
var detective = require("detective");

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
    publishToGitHubAndNpm: byId("publish-to-github-and-npm"),
    loginButton: byId("loginButton"),
    moduleName: byId("moduleName"),
    npmUserName: byId("npmUserName"),
    docsSource: byId("docsSource"),
    testSource: byId("testSource"),
    demoSource: byId("demoSource"),
    sourceCode: byId("sourceCode"),
    depsSearch: byId("depsSearch"),
    depsList: byId("depsList"),
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
    
    elems.npmUserName.value = user.login;
    codeModule.metaData.npmUserName = user.login;
    
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
        else if (document.body != document.activeElement && (event.keyCode == 13 && event.shiftKey)) {
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
        elems.moduleName.select();
      }, 180);
    }
  },
  {
    name: "deps",
    leadingElement: elems.depsArrow,
    buttonElement: elems.depsButton,
    element: elems.deps,
    onSet: function() {
      setTimeout(function() {
        elems.depsSearch.focus();
      }, 180);
    }
  },
  {
    name: "demo",
    leadingElement: elems.demoArrow,
    buttonElement: elems.demoButton,
    element: elems.demo,
    onSet: function() {
      setTimeout(function() {
        demoSourceEditor.focus();
      }, 180);
    }
  },
  {
    name: "test",
    leadingElement: elems.testArrow,
    buttonElement: elems.testButton,
    element: elems.test,
    onSet: function() {
      setTimeout(function() {
        testSourceEditor.focus();
      }, 180);
    }
  },
  {
    name: "docs",
    leadingElement: elems.docsArrow,
    buttonElement: elems.docsButton,
    element: elems.docs,
    onSet: function() {
      setTimeout(function() {
        docsSourceEditor.focus();
      }, 180);
    }
  },
  {
    name: "publish",
    leadingElement: elems.publishArrow,
    buttonElement: elems.publishButton,
    element: elems.publish,
    onSet: function() {
      setTimeout(function() {
        elems.npmUserName.focus();
        elems.npmUserName.select();
      }, 180);
    }
  }
];

elems.publishToGitHubAndNpm.addEventListener("click", function() {
  publishToRepo(codeModule, function(err, res) {
      if (err) {
          return;
      }
      console.log("res", res);
      // didPublishSuccessfully(res);
  });
});

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

var sourceCodeEditor = CodeMirror.fromTextArea(elems.sourceCode, {
    value: elems.sourceCode.textContent || "",
    mode: "javascript",
    lineNumbers: true,
    theme: "ambiance"
});
sourceCodeEditor.setSize(window.innerWidth/2, window.innerHeight);
sourceCodeEditor.on("change", sourceCodeChange);
function sourceCodeChange() {
    var newSource = sourceCodeEditor.getValue();
    try {
      var modules = detective(newSource);
      var newDeps = [];
      modules.map(function(module) {
        newDeps.push(module);
      });
      if (codeModule.deps.join(",") != newDeps.join(",")) {
        codeModule.deps = newDeps;
        updateDepsList();
      }
    }
    catch (e) {
      
    }
    codeModule.sourceCode = newSource;
}
sourceCodeEditor.setValue(codeModule.sourceCode);

var testSourceEditor = CodeMirror.fromTextArea(elems.testSource, {
    value: elems.testSource.textContent || "",
    mode: "javascript",
    lineNumbers: true,
    theme: "ambiance"
});
testSourceEditor.on("change", testSourceChange);
function testSourceChange() {
    codeModule.metaData.testSource = testSourceEditor.getValue();
}

var demoSourceEditor = CodeMirror.fromTextArea(elems.demoSource, {
    value: elems.demoSource.textContent || "",
    mode: "javascript",
    lineNumbers: true,
    theme: "ambiance"
});
//demoSourceEditor.getTextArea().nextSibling; // this is the DOM element of the editor...
demoSourceEditor.on("change", demoSourceChange);
function demoSourceChange() {
    codeModule.metaData.demoSource = demoSourceEditor.getValue();
}

var docsSourceEditor = CodeMirror.fromTextArea(elems.docsSource, {
    value: elems.docsSource.textContent || "",
    mode: "markdown",
    lineNumbers: true,
    theme: "ambiance"
});
docsSourceEditor.on("change", docsSourceChange);
function docsSourceChange() {
    codeModule.metaData.docsSource = docsSourceEditor.getValue();
}

window.addEventListener('resize', windowResize, true);
function windowResize(event) {
  sourceCodeEditor.setSize(window.innerWidth/2, window.innerHeight);
  if (guide.classList.contains("login")) {
    guide.style.marginLeft = -guide.offsetWidth/2 + "px";
    guide.style.marginTop = -guide.offsetHeight/2 + "px";
    guide.classList.remove("deactivated");
    guide.classList.add("activated");
  }
  var panes = document.querySelectorAll("#login, #docs, #demo, #test, #name, #deps, #publish");
  for (var i = 0; i < panes.length; i++) {
    var p = panes[i];
    p.style.height = window.innerHeight-80 + "px";
  }
}
windowResize();

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

function submitNpmUserName() {
  elems.npmUserName.blur();
  codeModule.metaData.npmUserName = elems.npmUserName.value;
}

function updateDepsList() {
  elems.depsList.innerHTML = "";
  for (var i = 0; i < codeModule.deps.length; i++) {
    var dep = codeModule.deps[i];
    addDepToList(dep);
  }
  if (codeModule.deps.length == 0) {
    elems.depsList.classList.add("hidden");
  }
}

function addDepToList(depName) {
  
  if (!depName || depName == "") {
    return;
  }
  /*
  <tr>
    <td>byId</td>
    <td><input type="text" value="byId" /></td>
    <td><i class="fa fa-times-circle"></i></td>
  </tr>
  */
  elems.depsList.classList.remove("hidden");
  var tr = document.createElement("tr");
  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var npmLink = document.createElement("a");
  npmLink.href = "https://npmjs.org/package/" + depName;
  npmLink.innerHTML = depName;
  td1.appendChild(npmLink);
  var depLocalVarName = document.createElement("input");
  depLocalVarName.type = "text";
  depLocalVarName.value = depName.replace("-", "_");
  
  var localVarName = depLocalVarName.value;
  depLocalVarName.addEventListener("keyup", function() {
    var newVarName = depLocalVarName.value;
    if (newVarName == localVarName) {
      return;
    }
    window[newVarName] = window[localVarName];
    delete window[localVarName];
    localVarName = newVarName;
  });
  
  var depScript = document.createElement("script");
  depScript.type = "text/javascript";
  depScript.charset = "utf-8";
  depScript.src = "http://wzrd.in/standalone/" + depName + "@latest";
  depScript.onload = depScript.onreadystatechange = function() {
    console.log("loaded", depName);
  }
  document.head.appendChild(depScript);
  //td2.appendChild(depLocalVarName); // we need to do a better mapping of this as well...
  var removeDep = document.createElement("i");
  removeDep.className = "fa fa-times-circle";
  td3.classList.add("close");
  td3.appendChild(removeDep);
  tr.appendChild(td1);
  tr.appendChild(td2);
  //tr.appendChild(td3); // no removeDep GUI for now... we'd need to go in and remove calls to require by searching the AST... 
  elems.depsList.appendChild(tr);
  removeDep.addEventListener("click", function() {
    var newDeps = codeModule.deps.splice(codeModule.deps.indexOf(depName), 1);
    updateDepsList();
  });
  elems.depsSearch.value = "";
}

elems.moduleName.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    submitName();
  }
});

elems.npmUserName.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    submitNpmUserName();
  }
});

elems.depsSearch.addEventListener("keyup", function(event) {
  if (event.keyCode === 13 && !event.shiftKey) {
    var depName = elems.depsSearch.value;
    if (!depName || depName == "") {
      return;
    }
    codeModule.deps.push(depName);
    var currentSource = sourceCodeEditor.getValue();
    var newSource = "var " + depName.replace("-", "_") + " = require('" + depName + "')\n" + currentSource;
    sourceCodeEditor.setValue(newSource);
    updateDepsList();
  }
});

function goToNextStep() {
  if (currentStep + 1 >= guideSteps.length) {
    console.log("publish??");
    return guideSteps[currentStep];
  }
  else {
    return goToStep(currentStep + 1);
  }
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
