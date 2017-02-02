#!/usr/bin/env node
'use strict';

var path = require('path');
var mdeps = require('module-deps');
var concat = require('concat-stream');
var esprima = require('esprima');
var estraverse = require('estraverse');
var estemplate = require('estemplate');
var escodegen = require('escodegen');

var modIDtoName = Object.create(null);
var dynamicRequires = false;

// core modules for node.js v0.12.7
// https://github.com/nodejs/node/blob/db1087c9757c31a82c50a1eba368d8cba95b57d0/lib/internal/module.js

var builtins = ['assert', 'buffer', 'child_process', 'cluster',
  'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'net',
  'os', 'path', 'punycode', 'querystring', 'readline', 'repl', 'stream',
  'string_decoder', 'tls', 'tty', 'url', 'util', 'v8', 'vm', 'zlib'];

// function filter (id) {
//     return !builtins.some(function (mod) {
//         return id.startsWith(mod);
//     });
// }

function initMap(moduleDeps) {
    var counter = 1;
    moduleDeps.forEach(function (dep) {
        var name;
        var ext = path.extname(dep.id);
        if (ext === '.js') {
            name = path.basename(dep.id, '.js').replace(/-/g, '_');
            name = '_mod_' + name + counter.toString();
        }
        else if (ext === '.json') {
            name = path.basename(dep.id, '.json').replace(/-/g, '_');
            name = '_mod_' + name + counter.toString();
        }
        else {
            throw ext + ' filename extension not supported';
        }
        modIDtoName[dep.id] = name;
        counter++;
    });
}

function wrapModule(module) {
    var modAST = esprima.parse(module.source, { loc: true });
    // wrap the module code in a function declaration, set the exports alias (node.js) and return exported API
    var ast = estemplate('function <%= modName %>(module) {var exports = module.exports; %= body %; return module.exports}', {
        modName: {type: 'Identifier', name: modIDtoName[module.id]},
        body: modAST.body
    });
    // replace the require calls in the module code by function calls
    estraverse.replace(ast, {
        enter: function (node) {
            if (node.type === 'CallExpression' && node.callee.name === 'require') {
                if (node.arguments[0].type !== 'Literal') {
                    var start = node.loc.start, end = node.loc.end;
                    console.warn(module.id + ":" + start.line + ":" + start.column + ":" + end.line + ":" + end.column + ": dynamic require call.");
                    dynamicRequires = true;
                    return this.skip();
                }
                // get the module name in the string argument of the require call
                var reqModID = module.deps[node.arguments[0].value];
                // if required module is a node.js module, skip
                if (!reqModID) return this.skip();
                // and replace it by a function call
                var replaced;
                if (path.extname(reqModID) === '.json') {
                  replaced = estemplate('<%= modName %>();', {
                      modName: {type: 'Identifier', name: modIDtoName[reqModID]}
                  });
                }
                else {
                  replaced = estemplate('<%= modName %>({exports: {}});', {
                      modName: {type: 'Identifier', name: modIDtoName[reqModID]}
                  });
                }
                return replaced.body[0].expression;
            }
        }
    });
    // return the AST of the module function declaration
    return ast.body[0];
}

function wrapJSONModule(module) {
    // a hack to parse json in esprima
    var expr = esprima.parse('(' + module.source + ');');
    var jsonAST = expr.body[0].expression;
    var ast = estemplate('function <%= modName %>() { return <%= object %>; }', {
        modName: {type: 'Identifier', name: modIDtoName[module.id]},
        object: jsonAST
    });
    return ast.body[0];
}

var md = mdeps({ filter: function (id) { return builtins.indexOf(id) < 0; }});
var file = path.resolve(process.argv[2]);

md.pipe(concat(function (moduleDeps) {
    var entry;
    var program = { "type": "Program", "body": [], "sourceType": "script" };
    initMap(moduleDeps);
    moduleDeps.forEach(function (dep) {
        var ast;
        if (path.extname(dep.id) === '.json') {
          ast = wrapJSONModule(dep);
        }
        else {
          ast = wrapModule(dep);
        }
        if (dep.entry) {
            entry = dep.id;
        }
        program.body.push(ast);
    });
    var entryPoint = estemplate('<%= modName %>({exports: {}});', {
        modName: {type: 'Identifier', name: modIDtoName[entry]}
    });
    program.body.push(entryPoint.body[0]);
    if (dynamicRequires) {
        throw "Can't handle dynamic arguments to require calls. Consider refactoring the code.";
    }
    else {
        console.log(escodegen.generate(program));
    }
}));
md.end(file);
