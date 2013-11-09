// var document = require("global/document")
var byId = require("by/id")

var Editor = require("./editor.js")
var Scroller = require("./scroller.js")
var Publisher = require("./publisher.js")

var elems = {
    scroll: byId("rightPanel"),
    demo: byId("demo"),
    docs: byId("docs"),
    test: byId("test"),
    demoButton: byId("scroll-to-demo"),
    docsButton: byId("scroll-to-docs"),
    testButton: byId("scroll-to-test"),
    publishButton: byId("publish"),
    loginButton: byId("login"),
    moduleName: byId("moduleName"),
    sourceCode: byId("sourceCode")
}

Scroller(elems)
var mirror = Editor(elems)
Publisher(elems, mirror)

require("../js-github/test.js")
