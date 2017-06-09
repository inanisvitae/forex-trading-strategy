var Analyze = require('./analyze.js');

var analysis = new Analyze();

analysis.rsi_calculate('EUR/USD', function(flag, result) {
	console.log(result);
});