function foo() {
	var a = 3;
	var b = iszero(a);
	console.log(b); // added
}
function iszero(z) {
	return z == 0;
}
foo(); // call foo so that WALA generates IR for the functions
