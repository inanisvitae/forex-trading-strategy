var moment = require('moment');
var Strategy = require('./app/strategy/strategy.js');

var strategy = new Strategy();


var interval = setInterval(function() {
	var modulus = moment().hour() % 4
	if(moment().minute() === 0 && modulus === 0) {
		strategy.rsi_macd_strategy();
	}
}, 25000);

