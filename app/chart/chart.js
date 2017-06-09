var trading_params = require('../../config.js').trading_params;
var Connection = require('../connect/connect.js');

module.exports = class Chart {
	constructor() {
		this.conn = new Connection();
	}

	get_chart(token, symbol, bars, cb) {
		var params = {
			Token : token,
			Product: symbol,
			TimeInterval: trading_params.Time_interval,
			Bars: bars
		};
		this.conn.get('Charting_url', '/GetChartsBlotterWithFixedBars', params, function(flag, body) {
			if(flag) {
				if(body.ChartData.Success) {
					var lst = body.ChartData.Data.split('$');
					var raw_data_open = lst.map(function(x) {
						var tmp = x.replace('\\\\', '/').split('\\');
						var result = [tmp[1], tmp[2], tmp[3], tmp[4]];
						return result.map(function(l) {
							return parseFloat(l);
						});
					});
					var marketData = {
						open: raw_data_open.map(function(x) {
							return x[0];
						}),
						close: raw_data_open.map(function(x) {
							return x[3];
						}),
						high : raw_data_open.map(function(x) {
							return x[1];
						}),
						low : raw_data_open.map(function(x) {
							return x[2];
						})
					};

					cb(flag, {data: marketData});
				}else{
					cb(false, {error: 'Error retrieving chart!'});
				}
			}else{
				cb(flag, {error: body.error});
			}
		});
	}
}