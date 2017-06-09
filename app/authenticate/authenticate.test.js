var Authenticate = require('./authenticate.js');

var Authenticate = new Authenticate();

Authenticate.get_token(function(flag, body) {
	console.log(flag);
	console.log(body);
});