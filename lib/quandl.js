var Quotes = require('./quotes');
// 

class Quandl extends Quotes {
    constructor(agent, key) {
        super(agent);
        this.key = key;
    }
    
    buildPriceURL(security) {
        throw "Quandl always return historical quotes";
    }

    buildHistoryURL(security) { 
        return "https://www.quandl.com/api/v3/datasets/"+(security.country=="CFTC"?"CFTC":"EOD")+"/"+security.ticker+".json?api_key="+this.key;
    }

    parseHistoryData(security, data) {
        data = JSON.parse(String(data));
        if (data.quandl_error) {
            console.log(data.quandl_error);
            throw data.quandl_error;
        } else {
            security.quotes = toSeries(data.dataset.column_names, data.dataset.data);
            security.cftcraw = data;
        }
        return security;
    }
}

function toSeries(columns, series) {
    var results = {};
    var dates = series.map(function(e) { return new Date(e[0]).fromGMTDate().getTime(); });
    columns.shift();
    columns.forEach(function(e,i) { 
        results[e] = series.map(function(e2,j) { return [ dates[j], e2[i+1] ]; });
    });
    return results;
}

module.exports = Quandl;
