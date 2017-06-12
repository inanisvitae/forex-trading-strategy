var Trade = require('./trade.js');

var trade = new Trade();

trade.place_trade('TKNpIUDrIPagJ%2BEk%2FyN1H6GB2Y23ZnWn4EGudvITwQOT6qs2YyhsKqSECH8rFFEirVDC8HY1%2FoXCFDKXYezsk27oaFX%2BuCR17rg49cstTioz69%2BGg%2Fs4pXjvLvizw4XwNCsqz42wdkt9tg%3D', 'B', '10000', 'USD/JPY', 0.001, function(flag, body) {
	console.log(body);
	console.log(flag);
})