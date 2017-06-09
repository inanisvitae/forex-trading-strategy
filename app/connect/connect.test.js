var Connection = require('./connect.js');


var conn = new Connection();
conn.get('Charting_url', '/GetChartsBlotterWithFixedBars', {'Product': 'EUR/USD', 'Token':'aldkfjakldsfj', 'TimeInterval': 'FOUR_HOUR', 'Bars': '50'}, function(flag, body) {
	if(flag){
		console.log(body);
	}else{
		console.log(body);
	}
});
