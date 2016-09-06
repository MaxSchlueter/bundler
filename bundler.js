var path = require('path');
var mdeps = require('module-deps');
var concat = require('concat-stream');
var esprima = require('esprima');
var estraverse = require('estraverse');
var estemplate = require('estemplate');
var escodegen = require('escodegen');

var modIDtoName = {};

function init(modsDep) {
    var counter = 0;
    modsDep.forEach(function (dep) {
        var name = path.basename(dep.id, '.js') + counter.toString();
        modIDtoName[dep.id] = name;
        counter++;
    });
//    console.log(modIDtoName);
}

function wrap(modID, modDeps, modAST) {
    // wrap the module code in a function declaration, set the exports alias (node.js) and return exported API
    var ast = estemplate('function <%= modName %>(module) {var exports = module.exports; %= body %; return module.exports}', {
        modName: {type: 'Identifier', name: modIDtoName[modID]},
        body: modAST.body
    });
//    console.log(JSON.stringify(ast, null, 2));
    // replace the require calls in the module by function calls
    estraverse.replace(ast, {
        enter: function (node) {
            if (node.type === 'CallExpression' && node.callee.name === 'require') {
                if (node.arguments[0].type !== 'Literal') {
                    // Can't handle dynamic arguments to require
                    return this.skip();
                }
                // get the module name in the string argument of the require call
                var reqModID = modDeps[node.arguments[0].value];
                // replace it by a function call...
                var replaced = estemplate('<%= modName %>({exports: {}});', {
                    modName: {type: 'Identifier', name: modIDtoName[reqModID]}
                });
                return replaced.body[0].expression;
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
    init(body);
    body.forEach(function (dep) {
        var ast = esprima.parse(dep.source);
        if (dep.entry)
            entry = dep.id;
        program.body.push(wrap(dep.id, dep.deps, ast));
    });
    var entryPoint = estemplate('<%= modName %>({exports: {}});', {
        modName: {type: 'Identifier', name: modIDtoName[entry]}
    });
    program.body.push(entryPoint.body[0]);
//    console.log(JSON.stringify(program, null, 2));
    console.log(escodegen.generate(program));
}));
md.end(file);
