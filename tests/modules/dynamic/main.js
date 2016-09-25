var mods = ['./a.js', './b.js']; 
mods.forEach(function(mod) {
    console.log(require(mod));
});
