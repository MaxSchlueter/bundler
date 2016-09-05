function hello(module) {
    var exports = module.exports;
    var str =/* require('./world.js');*/ world({exports: {}});
    console.log("hello " + str);
    return module.exports;
}
