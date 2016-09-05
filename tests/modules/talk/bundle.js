function mod_foo(module) {
	var exports = module.exports;
	var iszero = mod_iszero({exports:{}});
	var a = 3;
	var b = iszero(a);
	return module.exports;
}
function mod_iszero(module) {
	var exports = module.exports;
	module.exports = function(z) {
		return z == 0;
	}
	return module.exports;
}
mod_foo({exports:{}});	
