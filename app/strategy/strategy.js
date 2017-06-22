var trading_params = require('../../config.js').trading_params;
var Chart = require('../chart/chart.js');
var Authenticate = require('../authenticate/authenticate.js');
var Analyze = require('../analyze/analyze.js');
var Trade = require('../trade/trade.js');
var Authenticate = require('../authenticate/authenticate.js');
var Position = require('../position/position.js');
var async = require('async');

module.exports = class Strategy {
	constructor() {
		this.chart = new Chart();
		this.credential = new Authenticate();
		this.analysis = new Analyze();
		this.trade = new Trade();
		this.position = new Position();
		this.symbols_lst = Object.keys(trading_params.Symbols);
	}

	rsi_macd_strategy() {
		var self = this;
		for (var i = this.symbols_lst.length - 1; i >= 0; i--) {
			async.waterfall([
				function(cb) {
					var symbol = self.symbols_lst[i];
					self.analysis.macd_calculate(symbol, 'FOUR_HOUR', function(flag, result) {
						cb(null, flag, result, symbol);
					});
				},
				function(prev_flag, prev_result, symbol, cb) {
					self.analysis.rsi_calculate(symbol, 'FOUR_HOUR', function(flag, result) {
						prev_result.RSI = result;
						cb(null, flag, prev_result, symbol);
					});
				},
				function(prev_flag, prev_result, symbol, cb) {
					if(prev_flag) {
						


						var macd_result = prev_result.MACD.result.outMACDHist;
						var rsi_result = prev_result.RSI.RSI.result.outReal;
						var latest_macd_result = macd_result[macd_result.length - 1];
						var latest_macd_result1 = macd_result[macd_result.length - 2];
						var latest_rsi_result = rsi_result[rsi_result.length - 1];


						var latest_macd_val = prev_result.MACD.result.outMACD[macd_result.length - 1];
						var latest_macd_signal_val = prev_result.MACD.result.outMACDSignal[macd_result.length - 1];
						console.log("macd:");
						console.log(prev_result.MACD)
						console.log(latest_macd_result);
						console.log(latest_macd_result1);
						console.log("rsi:");
						console.log(prev_result.RSI.RSI);
						console.log(latest_rsi_result);
						

						self.credential.get_token(function(flag, body) {
							if(flag) {
								self.position.get_position_blotter_with_filter(body.token, symbol, function(pos_flag, pos_body) {
									if(pos_flag) {
										if(parseInt(pos_body.contract) == 0) {
											//Places trades here.
											if(latest_macd_result > 0 && latest_macd_result1 < 0 && latest_rsi_result >= 20 && latest_macd_val >=0 && latest_macd_signal_val >= 0) {
												console.log("Chance detected!");
												console.log(symbol);
												self.trade.place_trade(body.token, 'S', '2000', symbol, trading_params.Symbols[symbol].Decimal, function(final_flag, final_result) {
													if(final_flag) {
														console.log("Trade placed!");
														cb(null, true);
													}else{
														console.log(final_result.error);
														cb(null, false);
													}
												});
												
											}else if(latest_rsi_result <  0 && latest_macd_result1 > 0 && latest_rsi_result <= 80 && latest_macd_val <=0 && latest_macd_signal_val <= 0){
												self.trade.place_trade(body.token, 'B', '2000', symbol, trading_params.Symbols[symbol].Decimal, function(final_flag, final_result) {
													if(final_flag) {
														//Writes to database on cloud
														console.log("Trade placed!");
														cb(null, true);
													}else{
														console.log(final_result.error);
														cb(null, false);
													}
												});
											}
										}else{
											console.log("The position exists!");
											cb(null, false);
										}
									}else{
										console.log("Error retrieving position");
										console.log(body.error);
										cb(null, false);
									}
								});
							}else{
								console.log("Error retrieving token!");
								cb(null, false);
							}
						});
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

	multiTimeFrameAnalysis() {
		var self = this;
		//Get the analysis report of FOUR_HOUR and DAILY
		//If FOUR_HOUR indicates a buy, look at DAILY trend, 
		//If DAILY trend is a sell, then look at the DAILY trend to see if it's actually a sell or it's about to flip.
		//If DAILY trend is a buy, then buy.

		//If FOUR_HOUR indicates a sell, look at DAILY trend,
		//If DAILY trend is a buy, then look at the DAILY trend to see if it's actually a buy or it's about to flip.
		//If DAILY trend is a sell, then sell.

		// for (var i = this.symbols_lst.length - 1; i >= 0; i--) {
		// 	async.waterfall([
		// 		function(cb) {
		// 			var symbol = self.symbols_lst[i];
		// 			self.analysis.macd_calculate(symbol, 'FOUR_HOUR', function(flag, result) {
		// 				cb(null, flag, result, symbol);
		// 			});
		// 		},
		// 		function(prev_flag, prev_result, symbol, cb) {
		// 			self.analysis.rsi_calculate(symbol, 'FOUR_HOUR', function(flag, result) {
		// 				prev_result.RSI = result;
		// 				cb(null, flag, prev_result, symbol);
		// 			});
		// 		},

		// 		function(prev_flag, prev_result, symbol, cb) {
		// 			if(prev_flag) {

		// 				var macd_result = prev_result.MACD.result.outMACDHist;
		// 				var rsi_result = prev_result.RSI.RSI.result.outReal;
		// 				var latest_macd_result = macd_result[macd_result.length - 1];
		// 				var latest_macd_result1 = macd_result[macd_result.length - 2];
		// 				var latest_rsi_result = rsi_result[rsi_result.length - 1];


		// 				var latest_macd_val = prev_result.MACD.result.outMACD[macd_result.length - 1];
		// 				var latest_macd_signal_val = prev_result.MACD.result.outMACDSignal[macd_result.length - 1];
		// 				console.log("macd:");
		// 				console.log(prev_result.MACD)
		// 				console.log(latest_macd_result);
		// 				console.log(latest_macd_result1);
		// 				console.log("rsi:");
		// 				console.log(latest_rsi_result);
						

		// 				self.credential.get_token(function(flag, body) {
		// 					if(flag) {
		// 						self.position.get_position_blotter_with_filter(body.token, symbol, function(pos_flag, pos_body) {
		// 							if(pos_flag) {
		// 								if(parseInt(pos_body.contract) == 0) {
		// 									//Places trades here.
		// 									if(latest_macd_result > 0 && latest_macd_result1 < 0 && latest_rsi_result >= 20 && latest_macd_val >=0 && latest_macd_signal_val >= 0) {
		// 										console.log("Chance detected!");
		// 										console.log(symbol);
		// 										self.trade.place_trade(body.token, 'S', '2000', symbol, trading_params.Symbols[symbol].Decimal, function(final_flag, final_result) {
		// 											if(final_flag) {
		// 												console.log("Trade placed!");
		// 												cb(null, true);
		// 											}else{
		// 												console.log(final_result.error);
		// 												cb(null, false);
		// 											}
		// 										});
												
		// 									}else if(latest_rsi_result <  0 && latest_macd_result1 > 0 && latest_rsi_result <= 80 && latest_macd_val <=0 && latest_macd_signal_val <= 0){
		// 										self.trade.place_trade(body.token, 'B', '2000', symbol, trading_params.Symbols[symbol].Decimal, function(final_flag, final_result) {
		// 											if(final_flag) {
		// 												//Writes to database on cloud
		// 												console.log("Trade placed!");
		// 												cb(null, true);
		// 											}else{
		// 												console.log(final_result.error);
		// 												cb(null, false);
		// 											}
		// 										});
		// 									}
		// 								}else{
		// 									console.log("The position exists!");
		// 									cb(null, false);
		// 								}
		// 							}else{
		// 								console.log("Error retrieving position");
		// 								console.log(body.error);
		// 								cb(null, false);
		// 							}
		// 						});
		// 					}else{
		// 						console.log("Error retrieving token!");
		// 						cb(null, false);
		// 					}
		// 				});
		// 			}else{
		// 				console.log("Error retrieving technical results!");
		// 				cb(null, false);
		// 			}
		// 		}
		// 		], function(err, flag) {
		// 			if(flag) {
		// 				console.log("Successfully traded!");
		// 			}else{
		// 				console.log("There is an error when placing trades!")
		// 			}
		// 		});
		// }
	}
}