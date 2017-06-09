var Chart = require('./chart.js');

var chart = new Chart();

chart.get_chart('TKN0khEZCekejTDp%2Fs%2BcWwrZtyM8fJGnpYOmrlQ2mr3fdN9ZTQDdRGFbYNsurO246NDi1wal9KHjZIllBqgYymr%2FbgQexKwKRwK0qv3CylwM0gtKNgexci0%2Fzm2NXggfgvSEn9475xKTns%3D', 'EUR/USD', '50', function(flag, body) {
	console.log(body);
});