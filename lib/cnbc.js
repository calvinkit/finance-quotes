var Quotes = require('./quotes');

class CNBC extends Quotes {
    constructor(agent) {
        super(agent);
    }

    //https://quote.cnbc.com/quote-html-webservice/quote.htm?symbols=@CL.1&requestMethod=quick&exthrs=1&noform=1&fund=1&output=json&
    buildPriceURL(security) {
        if (security.country=="MUTF_CA") throw new Error("CNBC doesn't support mutual fund");
        var suffix = (security.country=="TSE"?"-CA":"");
        return "https://quote.cnbc.com/quote-html-webservice/quote.htm?output=json&symbols="+security.ticker+suffix;
    }

    parsePriceData(security, data) {
        var priceInfo = JSON.parse(data);
        priceInfo = priceInfo.QuickQuoteResult.QuickQuote;
        security.name = priceInfo.onAirName;
        security.price = parseFloat(priceInfo.last);
        security.change = parseFloat(priceInfo.change);
        security.pchange = Math.round(security.change/parseFloat(priceInfo.previous_day_closing)*10000)/100;
        security.exchange = priceInfo.exchange;
        return security;
    }
}

module.exports = CNBC;
