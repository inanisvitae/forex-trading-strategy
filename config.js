var trading_params = {
	StopLoss_Limit_base: 50,
	Win_loss_ratio: 3,
	Time_interval: 'FOUR_HOUR',
	Username: 'hongzq99@163.com',
	Password: 'jin',
	Trading_url: 'http://demoweb.efxnow.com/GainCapitalWebServices/Trading/TradingService.asmx',
	Charting_url: 'http://democharting.efxnow.com/Charting/ChartingService.asmx',
	Authenticate_url: 'http://demoweb.efxnow.com/gaincapitalwebservices/authenticate/authenticationservice.asmx',
	Symbols: {
		'EUR/USD': {
			Decimal: 0.0001
		},
		'GBP/USD': {
			Decimal: 0.0001
		},
		'USD/JPY': {
			Decimal: 0.001
		},
		'AUD/USD': {
			Decimal: 0.0001
		},
		'USD/CAD': {
			Decimal: 0.0001
		},
		'USD/CHF': {
			Decimal: 0.0001
		},
		'NZD/USD': {
			Decimal: 0.0001
		}
	}
}


// "https://prodweb.efxnow.com/",
// "http://livecharting.efxnow.com/",
// "https://prodweb.efxnow.com/"

exports.trading_params = trading_params