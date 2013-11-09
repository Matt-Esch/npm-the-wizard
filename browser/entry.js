require('../js-github/test.js');

 var codeModule;

// from Paul Irish at some point...
window.requestAnimationFrame = (function(callback) {
  return window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || 
  window.oRequestAnimationFrame || 
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(function() {
      var timestamp = Date.now();
      callback(timestamp);
    }, 1000 / 60);
  };
})();

//https://gist.github.com/dezinezync/5487119
function scrollTo(Y, element, duration, easingFunction, callback) {

  var start = Date.now();
  var   from = element.scrollTop;

  if(from === Y && typeof(callback) != "undefined") {
      callback();
      return; /* Prevent scrolling to the Y point if already there */
  }

  function min(a,b) {
    return a<b?a:b;
  }

  function scroll(timestamp) {

      var currentTime = Date.now();
      var time = min(1, ((currentTime - start) / duration));
      var easedT = easingFunction(time);

      documentScrollTop = (easedT * (Y - from)) + from;
      element.scrollTop = documentScrollTop;

      if (time < 1) {
        requestAnimationFrame(scroll);
      }
      else {
        if (callback) {
          callback(); 
        }
      }

  }

  requestAnimationFrame(scroll);
}

/* bits and bytes of the scrollTo function inspired by the works of Benjamin DeCock */

/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
var easing = {
  // no easing, no acceleration
  linear: function (t) { return t },
  // accelerating from zero velocity
  easeInQuad: function (t) { return t*t },
  // decelerating to zero velocity
  easeOutQuad: function (t) { return t*(2-t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  // accelerating from zero velocity 
  easeInCubic: function (t) { return t*t*t },
  // decelerating to zero velocity 
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  // accelerating from zero velocity 
  easeInQuart: function (t) { return t*t*t*t },
  // decelerating to zero velocity 
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  // accelerating from zero velocity
  easeInQuint: function (t) { return t*t*t*t*t },
  // decelerating to zero velocity
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}

var scrollElement = document.getElementById("right-panel");
var demoElement = document.getElementById("demo");
var docsElement = document.getElementById("docs");
var testElement = document.getElementById("test");

scrollElement.onscroll = function(event) {
  var sections = [demoElement, docsElement, testElement];
  var currentSelection;
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    if (scrollElement.scrollTop > section.offsetTop - 21) {
      currentSelection = section;
    }
  }
  if (currentSelection.id) {
    var buttons = document.querySelectorAll("#menu button");
    var button;
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active");
    }
    document.querySelector("#menu button." + currentSelection.id).classList.add("active");
  }
}

var scrollToDemo = function() {
  scrollTo(demoElement.offsetTop-20, scrollElement, 300, easing.easeInQuad);
}

var scrollToDocs = function() {
  scrollTo(docsElement.offsetTop-20, scrollElement, 300, easing.easeInQuad);
}

var scrollToTest = function() {
  scrollTo(testElement.offsetTop-20, scrollElement, 300, easing.easeInQuad);
}

var NpmGitGithub = {
  publish: function(codeModule, callback) {
    var name = codeModule.name;
    var deps = codeModule.deps;
    var metaData = codeModule.metaData;
    var sourceCode = codeModule.sourceCode;
    callback(false, {
      name: name,
      message: "didPublishSuccessfully",
      code: 200
    });
  }
}

var publishToRepo = NpmGitGithub.publish;

var didPublishSuccessfully = function(res) {
  
}

var publish = function() {
  publishToRepo(codeModule, function(err, res) {
    if (err) {
      return;
    }
    didPublishSuccessfully(res);
  });
}

