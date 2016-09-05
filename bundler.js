var path = require('path');
var mdeps = require('module-deps');
var concat = require('concat-stream');
var esprima = require('esprima');
var estraverse = require('estraverse');
var estemplate = require('estemplate');
var escodegen = require('escodegen');

//var tmpl = estemplate.compile('function (module) {%= body %};', {attachComment: true});

function wrap(modName, mod) {
    // wrap the module code in a function declaration, set the exports alias (node.js) and return exported API
    var ast = estemplate('function <%= funName %>(module) {var exports = module.exports; %= body %; return module.exports}', {
        funName: {type: 'Identifier', name: 'mod_'.concat(modName)},
        body: mod.body
    });
//    console.log(JSON.stringify(ast, null, 2));
    // replace the require calls in the module by function calls
    estraverse.replace(ast, {
        enter: function (node) {
            if (node.type === 'CallExpression') {
                if (node.callee.name === 'require') {
                    // get the module name in the string argument of the require call
                    var reqModName = path.basename(node.arguments[0].value, '.js');
                    // replace it by a function call...
                    var replaced = estemplate('<%= modName %>({exports: {}});', {
                        modName: {type: 'Identifier', name: 'mod_'.concat(reqModName)}
                    });
                    return replaced.body[0].expression;
                }
            }
        }
    });
//    console.log(JSON.stringify(ast, null, 2));
//    console.log(escodegen.generate(ast));
    // return the AST of the module function declaration
    return ast.body[0];
}

var md = mdeps();
var file = path.resolve(process.argv[2]);
md.pipe(concat(function (body) {
    var entry;
    var program = { "type": "Program", "body": [], "sourceType": "script" };
    body.forEach(function (dep) {
        var ast = esprima.parse(dep.source);
        var name = path.basename(dep.id, '.js');
        if (dep.entry)
            entry = name;
        program.body.push(wrap(name, ast));
    });
    var entryPoint = estemplate('<%= modName %>({exports: {}});', {
        modName: {type: 'Identifier', name: 'mod_'.concat(entry)}
    });
    program.body.push(entryPoint.body[0]);
//    console.log(JSON.stringify(program, null, 2));
    console.log(escodegen.generate(program));
}));
md.end(file);
