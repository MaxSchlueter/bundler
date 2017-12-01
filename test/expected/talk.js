function _mod_iszero(module) {
    var exports = module.exports;
    module.exports = function (z) {
        return z == 0;
    };
    return module.exports;
}
function _mod_main(module) {
    var exports = module.exports;
    var iszero = _mod_iszero({ exports: {} });
    var a = 3;
    var b = iszero(a);
    console.log(b);
    return module.exports;
}
_mod_main({ exports: {} });
