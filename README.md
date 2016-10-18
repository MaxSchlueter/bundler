# Bundler
Bundle CommonJS Modules into a single JS file s.t. the code can be analyzed statically.

# Example
Example in tests/modules/commonjs/ is the code sample found in http://wiki.commonjs.org/wiki/Modules/1.1
```
$ node bundler.js tests/modules/commonjs/program.js
function math0(module) {
    var exports = module.exports;
    exports.add = function () {
        var sum = 0, i = 0, args = arguments, l = args.length;
        while (i < l) {
            sum += args[i++];
        }
        return sum;
    };
    return module.exports;
}
function increment1(module) {
    var exports = module.exports;
    var add = math0({ exports: {} }).add;
    exports.increment = function (val) {
        return add(val, 1);
    };
    return module.exports;
}
function program2(module) {
    var exports = module.exports;
    var inc = increment1({ exports: {} }).increment;
    var a = 1;
    console.log(inc(a));
    module.id == 'program';
    return module.exports;
}
program2({ exports: {} });
```
If there are no dependency cycles and no dynamic require calls, i.e. the argument to a require call is not a string literal, then the transformed code is semantically equivalent to the module code:
```
$ node tests/modules/commonjs/program.js
2
$ node bundler.js tests/modules/commonjs/program.js | node
2
```
