function _mod_foo(module) {
    var exports = module.exports;
    exports.str = 'exported a string';
    exports.add = function (a, b) {
        return a + b;
    };
    return module.exports;
}
function _mod_main(module) {
    var exports = module.exports;
    var foo = _mod_foo({ exports: {} });
    console.log(foo.str);
    console.log(foo.add(2, 2));
    return module.exports;
}
_mod_main({ exports: {} });
