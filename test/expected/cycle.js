function _mod_b(module) {
    var exports = module.exports;
    console.log('b starting');
    exports.done = false;
    var a = _mod_a({ exports: {} });
    console.log('in b, a.done = %j', a.done);
    exports.done = true;
    console.log('b done');
    return module.exports;
}
function _mod_a(module) {
    var exports = module.exports;
    console.log('a starting');
    exports.done = false;
    var b = _mod_b({ exports: {} });
    console.log('in a, b.done = %j', b.done);
    exports.done = true;
    console.log('a done');
    return module.exports;
}
function _mod_main(module) {
    var exports = module.exports;
    console.log('main starting');
    var a = _mod_a({ exports: {} });
    var b = _mod_b({ exports: {} });
    console.log('in main, a.done=%j, b.done=%j', a.done, b.done);
    return module.exports;
}
_mod_main({ exports: {} });
