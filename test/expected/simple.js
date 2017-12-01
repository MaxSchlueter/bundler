function _mod_world(module) {
    var exports = module.exports;
    module.exports = 'world';
    return module.exports;
}
function _mod_main(module) {
    var exports = module.exports;
    var str = _mod_world({ exports: {} });
    console.log('hello ' + str);
    return module.exports;
}
_mod_main({ exports: {} });
