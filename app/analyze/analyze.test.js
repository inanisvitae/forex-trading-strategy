var Analyze = require('./analyze.js');

var analysis = new Analyze();

analysis.macd_calculate('USD/JPY', function(flag, result) {
	console.log(result);
});