function world(module) {
    var exports = module.exports;
    module.exports = 'world';
    return module.exports;
}
function hello(module) {
    var exports = module.exports;
    var str = world({ exports: {} });
    console.log('hello ' + str);
    return module.exports;
}
hello({ exports: {} });
