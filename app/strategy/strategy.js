var trading_params = require('../../config.js').trading_params;
var Chart = require('../chart/chart.js');
var Authenticate = require('../authenticate/authenticate.js');
var Analyze = require('../analyze/analyze.js');
var Trade = require('../trade/trade.js');


module.exports = class Strategy {
	constructor() {
		this.chart = new Chart();
		this.analysis = new Analyze();
		this.credential = new Authenticate();
		this.trade = new Trade();
	}

	rsi_macd_strategy() {
		
	}
}