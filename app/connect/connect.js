var trading_params = require('../../config.js').trading_params;
var request = require('request');
var parser = require('xml2json');


module.exports = class Connection {
	constructor() {
		
	}

	get(url_root_flag, url_mark, params, cb) {
		if(
			params != undefined 
			&& params != ''
			&& url_root_flag != '' 
			&& url_mark != '' 
			&& url_root_flag != undefined 
			&& url_mark != undefined
			) {

			var params_key_lst = Object.keys(params);
			var request_url;

			if(params_key_lst.length == 0) {
				request_url = trading_params[url_root_flag] + url_mark;
			}else{
				var k_v_pairs = params_key_lst.map(function(x) {
					return x + '=' + params[x];
				});
				request_url = trading_params[url_root_flag] + url_mark + '?' + k_v_pairs.join('&');
				console.log(request_url);
			}
			request({
				url: request_url
			}, function(error, response, body) {
				if(error){
					console.log("Connection error!");
					cb(false, {error: 'Connection error callback!'})
				}else{
					var xml = body;
					try{
						var json = parser.toJson(xml);
						var json_obj = JSON.parse(json);
						cb(true, json_obj);
					}catch(e) {
						cb(false, {error: 'Parsing error callback!'});
					}
				}
			});
		}else{
			cb(false, {error: 'Params missing!'});
		}
	}
};
