var trading_params = require('../../config.js').trading_params;
var Connection = require('../connect/connect.js');
var urlencode = require('urlencode');


module.exports = class Authenticate {
	constructor() {
		this.conn = new Connection();
	}

	get_token(cb) {
		console.log(trading_params.Authenticate_url)
		var params = {
			userID: trading_params.Username,
			password: trading_params.Password
		};
		this.conn.get('Authenticate_url','/AuthenticateCredentials', params, function(flag, body) {
			if(flag) {
				if(body.AuthenticationResult.success) {
					cb(flag, {token: urlencode(body.AuthenticationResult.token)});
				}else{
					cb(false, {error: 'Credential error!'});
				}
			}else{
				cb(flag, {error: body.error});
			}
		});
	}


}