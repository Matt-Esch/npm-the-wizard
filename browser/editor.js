var CodeMirror = require("./lib/code-mirror.js")

module.exports = Editor

function Editor(elems) {
    var mirror = CodeMirror.fromTextArea(elems.sourceCode, {
        value: elems.sourceCode.textContent || "",
        mode: "javascript",
        lineNumbers: true,
        theme: "ambiance"
    })

    return mirror
}
