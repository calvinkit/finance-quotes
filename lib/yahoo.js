var Quotes = require('./quotes');
var csv2array = require('csv2array');
var moment = require('moment');

class Yahoo extends Quotes {
    constructor(agent) {
        super(agent);
    }
    
    //https://query1.finance.yahoo.com/v7/finance/quote?symbol={0}?period1=1520786681&period2=1523465081&interval=1d&events=history&crumb=j/EP.nt7PHp
    buildHistoryURL(security) {
        return 'https://query1.finance.yahoo.com/v7/finance/download/'+security.yticker+(security.country!='United States'?'.TO':'')+'?period1=1520786681&period2=1523465081&interval=1d&events=history&crumb=j/EP.nt7PHp';
    }

    parseHistoryData(security, data) {
        try {
            if (data.substr(0,4) == "Date") {
                data = csv2array(data);
                data.splice(0,1);
                security.quotes = new Array();
                data.forEach((e) => {
                    if (e.length > 1 ) 
                    security.quotes.push({ 
                        date:moment(e[0]).toDate().getTime(), 
                        price: parseFloat(e[4]),
                        vol: parseFloat(e[5]),
                        lo: parseFloat(e[3]),
                        hi: parseFloat(e[2])
                    });
                });
                security.quotes.sort(function(a,b) { return (a.date<b.date?-1:1); });
                return security;
            }
        } catch (err) {
            onerror(security);
            logger.log('error','QuoteServer.yahoo_gethistory:', security.ticker, err);
        }
    }
}

module.exports = Yahoo;
