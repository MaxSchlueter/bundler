function _mod_math(module) {
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
function _mod_increment(module) {
    var exports = module.exports;
    var add = _mod_math({ exports: {} }).add;
    exports.increment = function (val) {
        return add(val, 1);
    };
    return module.exports;
}
function _mod_main(module) {
    var exports = module.exports;
    var inc = _mod_increment({ exports: {} }).increment;
    var a = 1;
    console.log(inc(a));
    module.id == 'program';
    return module.exports;
}
_mod_main({ exports: {} });
