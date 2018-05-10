var Quotes = require('./quotes');
var csv2array = require('csv2array');

class Morningstar extends Quotes {
    constructor(agent) {
        super(agent);
    }

    //http://financials.morningstar.com/ajax/exportKR2CSV.html?&callback=?&t={0}&region={1}&culture=en-US&cur=&order=asc"
    buildPriceURL(security) {
        return ['http://financials.morningstar.com/ajax/exportKR2CSV.html?&callback=?&t=',security.ticker,'&region=',security.country!="United States"?"can":"usa",'&order=asc'].join('');
    }

    buildHistoryURL(security) {
        throw "Morningstar Doesn't support history quotes";
    }

    parsePriceData(security, data) {
        var financial = {};
        var data = csv2array(String(data));

        // Clean up header
        data.splice(0,2);

        // Getting financial data
        var dates = data.shift().slice(1); var what = "Overview"; financial[what] ={}; dates.splice(-1); 
        while (data[0][0] != "") { 
            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
        }
        financial[what].dates = dates.map(function(e) { return new Date(e).fromGMTDate().getTime(); });
        data.shift();data.shift();
        //console.log(Object.keys(financial).pop());

        // Getting margins of % of sales (% of sales)
        var dates = data.shift().slice(1); var what = "Profit Margin % of Sales"; financial[what] = {};  dates.splice(-1); 
        while (data[0] != null && data[0][0] != "") { 
            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
        }
        financial[what].dates = dates.map(function(e) { return new Date(e).fromGMTDate().getTime(); });
        data.shift();
        //console.log(Object.keys(financial).pop());

        // Getting Profitability
        var dates = data.shift().slice(1); var what = "Profitability"; financial[what] = {}; dates.splice(-1); 
        while (data[0] != null && data[0][0] != "") { 
            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
        }
        financial[what].dates = dates.map(function(e) { return new Date(e).fromGMTDate().getTime(); });
        data.shift();data.shift();
        //console.log(Object.keys(financial).pop());

        // Getting growth % 
        var dates = data.shift().slice(1); dates.splice(-1);
        for (var i=0; i<4; i++) {
            var what = data.shift()[0];
            financial[what] = {};

            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
            financial[what].dates = dates.map(function(e) { return new Date(e).fromGMTDate().getTime(); });
        }
        data.shift();data.shift();
        //console.log(Object.keys(financial).pop());

        // Cashflow
        var dates = data.shift().slice(1); var what = "Cashflow Ratios"; financial[what] = {}; dates.splice(-1); 
        while (data[0] != null && data[0][0] != "") { 
            var tmp = data.shift();
            financial[what][tmp.shift()] = tmp;
        }
        financial[what].dates = dates.map(function(e) { return new Date(e).fromGMTDate().getTime(); });
        data.shift();data.shift();
        //console.log(Object.keys(financial).pop());

        // Key Ratios->Financial Health (Balance sheet ratio)
        var dates = data.shift().slice(1); var what = "BalanceSheet Ratios"; financial[what] = {}; dates.splice(-1); 
        while (data[0] != null && data[0][0] != "") { 
            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
        }
        financial[what].dates = dates.map(function(e) { return new Date(e).fromGMTDate().getTime(); });
        data.shift();
        //console.log(Object.keys(financial).pop());

        // Liqudity/Fianncial ratio
        var dates = data.shift().slice(1); var what = "Liqudity Ratios"; financial[what] = {}; dates.splice(-1); 
        while (data[0] != null && data[0][0] != "") { 
            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
        }
        financial[what].dates = dates.map(function(e) { return new Date(e).fromGMTDate().getTime(); });
        data.shift();data.shift();
        //console.log(Object.keys(financial).pop());
        
        // Efficiency Ratios
        var dates = data.shift().slice(1); var what = "Efficiency Ratios"; financial[what] = {}; dates.splice(-1); 
        while (data[0] != null && data[0][0] != "") { 
            var tmp = data.shift();
            tmp.splice(-1);
            financial[what][tmp.shift()] = tmp;
        }
        financial[what].dates = dates.map(function(e) { return new Date(e).fromGMTDate().getTime(); });
        //console.log(Object.keys(financial).pop());

        //console.log(financial);
        security.financial = financial;
        return security;
    }
}

module.exports = Morningstar;
