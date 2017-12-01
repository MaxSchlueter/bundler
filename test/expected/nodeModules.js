function _mod_helper(module) {
    var exports = module.exports;
    return module.exports;
}
function _mod_index(module) {
    var exports = module.exports;
    module.exports = function lib2() {
    };
    return module.exports;
}
function _mod_sublib(module) {
    var exports = module.exports;
    _mod_index({ exports: {} });
    return module.exports;
}
function _mod_index0(module) {
    var exports = module.exports;
    _mod_helper({ exports: {} });
    _mod_sublib({ exports: {} });
    return module.exports;
}
function _mod_main(module) {
    var exports = module.exports;
    _mod_index0({ exports: {} });
    return module.exports;
}
_mod_main({ exports: {} });
