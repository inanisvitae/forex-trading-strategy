var trading_params = require('../../config.js').trading_params;
var Chart = require('../chart/chart.js');
var Authenticate = require('../authenticate/authenticate.js');
var Analyze = require('../analyze/analyze.js');
var Trade = require('../trade/trade.js');
var Authenticate = require('../authenticate/authenticate.js');
var async = require('async');

module.exports = class Strategy {
	constructor() {
		this.chart = new Chart();
		this.credential = new Authenticate();
		this.analysis = new Analyze();
		this.trade = new Trade();
		this.symbols_lst = Object.keys(trading_params.Symbols);
	}

	rsi_macd_strategy() {
		var self = this;
		for (var i = this.symbols_lst.length - 1; i >= 0; i--) {

			async.waterfall([
				function(cb) {

					self.analysis.macd_calculate(self.symbols_lst[i], function(flag, result) {
						console.log(self.symbols_lst[i]);
						cb(null, flag, result);
					});
				},
				function(prev_flag, prev_result, cb) {
					self.analysis.rsi_calculate(self.symbols_lst[i], function(flag, result) {
						prev_result.RSI = result;
						cb(null, flag, prev_result);
					});
				},
				function(prev_flag, prev_result, cb) {
					if(prev_flag) {
						var macd_result = prev_result.MACD.result.outMACDHist;
						var rsi_result = prev_result.RSI.RSI.result;
						var latest_macd_result = macd_result[macd_result.length - 1];
						var latest_macd_result1 = macd_result[macd_result.length - 2];
						var latest_rsi_result = macd_result[rsi_result.length - 1];

						//Places trades here.
						if(latest_rsi_result >  0 && latest_macd_result1 < 0 && latest_rsi_result >= 20) {
							self.credential.get_token(function(flag, body) {
								if(flag){
									self.trade.place_trade(body.token, 'S', '100000', self.symbols_lst[i], trading_params.Symbols[self.symbols_lst[i]].Decimal, function(final_flag, final_result) {
										if(final_flag) {
											console.log("Trade placed!");
											cb(null, true);
										}else{
											console.log(final_result.error);
											cb(null, false);
										}
									});
								}else{
									console.log(body.error);
									cb(null, false);
								}
								
							});
							
						}else if(latest_rsi_result <  0 && latest_macd_result1 > 0 && latest_rsi_result <= 80){
							self.credential.get_token(function(flag, body) {
								if(flag){
									self.trade.place_trade(body.token, 'B', '100000', self.symbols_lst[i], trading_params.Symbols[self.symbols_lst[i]].Decimal, function(final_flag, final_result) {
										if(final_flag) {
											console.log("Trade placed!");
											cb(null, true);
										}else{
											console.log(final_result.error);
											cb(null, false);
										}
									});
								}else{
									console.log(body.error);
									cb(null, false);
								}
							});
						}

					}else{
						console.log("Error retrieving technical results!");
						cb(null, false);
					}
				}
				], function(err, flag) {
					if(flag) {
						console.log("Successfully traded!");
					}else{
						console.log("There is an error when placing trades!")
					}
				});
		}
	}
}