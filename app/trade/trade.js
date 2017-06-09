var trading_params = require('../../config.js').trading_params;
var Connection = require('../connect/connect.js');

module.exports = class Trade {
	constructor() {
		this.conn = new Connection();
	}

	deal_request_at_best(token, buy_sell, amount, symbol, cb) {
		var params = {
			Token: token,
			Product: symbol,
			BuySell: buy_sell,
			Amount: amount
		}
		this.conn.get('Trading_url', '/DealRequestAtBest', params, function(flag, body) {
			if(flag){
				cb(flag, body);
			}else{
				cb(false, {error: body.error});
			}
		});
	}

	place_oco_assp_order(token, buy_sell, amount, symbol, executed_rate, decimal, cb) {
		if(executed_rate == 0 || executed_rate == undefined){
			cb(false, {error: 'Executed rate error!'});
		}else{
			if(buy_sell != 'B' && buy_sell != 'S') {
				cb(false, {error: 'Buy sell signal error!'});
			}else{
				var stopLoss = 0;
				var takeProfit = 0;
				if(buy_sell == 'B') {
					takeProfit = parseFloat(executed_rate) + trading_params.StopLoss_Limit_base * decimal * trading_params.Win_loss_ratio;
					stopLoss = parseFloat(executed_rate) - trading_params.StopLoss_Limit_base * decimal;

				}else{
					takeProfit = parseFloat(executed_rate) - trading_params.StopLoss_Limit_base * decimal * trading_params.Win_loss_ratio;
			    	stopLoss = parseFloat(executed_rate) + trading_params.StopLoss_Limit_base * decimal;
				}
				var params = {
					Token: token,
					Product: symbol,
					LimitRate: takeProfit.toString(),
					StopRate: stopLoss.toString()
				};
				this.conn.get('Trading_url', '/PlaceOCOASSPOrder', params, function(flag, body) {
					if(flag) {
						if(body.BlotterOfPosition.Success) {
							cb(flag, body);
						}else{
							cb(false, {error: 'Error placing oco order!'});
						}
					}else{
						cb(false, {error: 'Error trading!'});
					}
				});
			}
		}
	}
}
