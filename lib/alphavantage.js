var Quotes = require('./quotes');
var csv2array = require('csv2array');
var moment = require('moment');

class AlphaVantage extends Quotes{
    constructor(agent, key) { 
        super(agent); 
        this.key = key; 
    }
	
	buildPriceURL(security) {
        if (security.country=="MUTF_CA") throw new Error("AlphaVantage doesn't support mutual fund");
        return 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&apikey='+this.key+'&datatype=csv&outputsize=full&symbol='+(security.country!='United States'?security.country+':':'')+security.ticker;
	}
	buildHistoryURL(security) {
		return this.buildPriceURL(security);
	}
	
	parsePriceData(security, data) {
		var quotes = csv2array(data);
		var bAdjClose = true;
	    security.quotes = new Array();
		for (var i=1; i<quotes.length; i++) {
			var e = quotes[i];
			security.quotes.push({ 
				date: new Date(e[0]).toGMTDate().getTime(),
				price: bAdjClose?parseFloat(e[5]):parseFloat(e[4]),
				vol: parseFloat(e[5]),
				lo: parseFloat(e[3]),
				hi: parseFloat(e[2])});
		}
		security.quotes.sort(function(a,b) { return (a.date<b.date?-1:1); });

		var latest = security.quotes.slice(-1)[0];
		var latest2 = security.quotes.slice(-2)[0];
		security.price = latest.price;
		security.change = latest.price-latest2.price;
		security.pchange = security.change/latest2.price*100;

		return security;
	}

    parseHistoryData(security, data) { return this.parsePriceData(security, data); }
}

module.exports = AlphaVantage;
