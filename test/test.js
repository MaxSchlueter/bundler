var fs = require('fs');
var path = require('path');
var test = require('tape');
// var concat = require('concat-stream')
var spack = require('../');

var dirs = fs.readdirSync(path.join(__dirname, 'modules'));

dirs.forEach(function (dir) {
  test('Test ' + dir, function (t) {
    t.plan(1);

		if (dir === 'cycle') {
			t.skip('Bundled module contents are nondeterministic, either module a comes first or b');
			return;
		}

		var file = path.join(__dirname, 'modules', dir, 'main.js');
		spack(file).then(function (bundle) {
			fs.readFile(path.join(__dirname, 'expected', dir + '.js'), 'utf8', function (err, expectation) {
				// add new line at the end, since test files contain one
				bundle += '\n';
				t.equal(bundle, expectation, 'Bundled module contents equals expected file contents');
			});
		}).catch(function (err) {
			t.assert(dir === 'dynamic', 'Should throw an error, contains dynamic require call');
		});
  });
});
