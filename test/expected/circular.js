function _mod_lib2(module) {
    var exports = module.exports;
    var lib1 = _mod_lib1({ exports: {} });
    module.exports = function lib2() {
        lib1();
    };
    return module.exports;
}
function _mod_lib1(module) {
    var exports = module.exports;
    var lib2 = _mod_lib2({ exports: {} });
    module.exports = function lib1() {
        lib2();
    };
    return module.exports;
}
function _mod_main(module) {
    var exports = module.exports;
    var lib1 = _mod_lib1({ exports: {} });
    lib1();
    return module.exports;
}
_mod_main({ exports: {} });
