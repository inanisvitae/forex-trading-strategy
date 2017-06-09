var Strategy = require('./app/strategy/strategy.js');

var strategy = new Strategy();


var interval = setInterval(function() {
	strategy.rsi_macd_strategy();
}, 14400000);