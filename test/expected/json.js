function _mod_sample() {
    return {
        'name': {
            'first': 'Max',
            'last': 'Mustermann'
        },
        'age': 10
    };
}
function _mod_main(module) {
    var exports = module.exports;
    var user = _mod_sample();
    console.log(user.name.first);
    return module.exports;
}
_mod_main({ exports: {} });
