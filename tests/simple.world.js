function world(module) {
    var exports = module.exports;
    module.exports = 'world';
    return module.exports;
}
