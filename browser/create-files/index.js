var extend = require("xtend")

var defaultTemplate = require("./template.js")
var Locals = require("./locals.js")

var isVariableRegex = /\{\{([^}]+)\}\}/g

Object.keys(defaultTemplate).forEach(function (key) {
    defaultTemplate[key] = defaultTemplate[key].join("\n")
})

module.exports = createFiles

function createFiles(module, callback) {
    Locals(module, function (err, locals) {
        if (err) {
            return callback(err)
        }

        var template = extend(defaultTemplate)
        Object.keys(template).forEach(function (key) {
            template[key] = template[key].replace(isVariableRegex,
                function (_, key) {
                    return locals[key]
                })
        })

        callback(null, template)
    })
}
