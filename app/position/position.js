var trading_params = require('../../config.js').trading_params;
var Connection = require('../connect/connect.js');


module.exports = class Position{
	constructor() {
		this.conn = new Connection();
	}

	get_position_blotter_with_filter(token, symbol, cb) {
		if(token == '' || token == undefined) {
			cb(false, {error: 'Error authenticating!'});
		}else{
			var params = {
				Token: token,
				Product: symbol
			};
			this.conn.get('Trading_url', '/GetPositionBlotterWithFilter', params, function(flag, body) {
				if(flag) {
					cb(true, {contract: body.BlotterOfPosition.Output.Position.Contract});
				}else{
					cb(false, {error: 'Error retrieving position'});
				}
			});
		}
	}
}