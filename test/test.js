var httpProxyAgent = require('http-proxy-agent');
var httpsProxyAgent = require('https-proxy-agent');
var util = require('util');
var httpsProxy = process.env.HTTP_PROXY?new httpsProxyAgent(process.env.HTTP_PROXY):null;
var httpProxy = process.env.HTTP_PROXY?new httpProxyAgent(process.env.HTTP_PROXY):null;
var avkey = process.env.ALPHAVANTAGE;
var qlkey = process.env.QUANDL;
var quotes = require('./../lib/index');


describe('AlphaVantage', function() {
    var security = { ticker:'GOOG',yticker:'GOOG', country:'United States' };
    it('getprice', function(done) {
        (new quotes.alphavantage(httpsProxy, avkey)).getprice(security, () => done(), function(security,err) { done(err) });
    });

    //it('gethistory', function(done) {
    //    (new quotes.alphavantage(httpsProxy, avkey)).gethistory(security, () => done(), function(security,err) { done(err) });
    //});
});

describe('Quandl', function() {
    var security = { ticker:'043602_F_ALL',yticker:'043602_F_ALL', country:'CFTC' };
    it('gethistory should return timeseries without error', function(done) {
        (new quotes.quandl(httpsProxy, qlkey)).gethistory(security, () => done(), function(security,err) { done(err) });
    });

    it('getprice should return with error', function(done) {
        (new quotes.quandl(httpsProxy, qlkey)).getprice(security, () => done('Should not be here'), function(security,err) { done() });
    });
});


describe('CNBC', function() {
    var security = { ticker:'GOOG',yticker:'GOOG', country:'United States' };
    it('getprice', function(done) {
        (new quotes.cnbc(httpsProxy)).getprice(security, () => done(), function(security,err) { done(err) });
    });

    it('gethistory should return with error', function(done) {
        (new quotes.cnbc(httpsProxy)).gethistory(security, () => done('Should not be here'), function(security,err) { done() });
    });
});

describe('Morningstar', function() {
    var security = { ticker:'GOOG',yticker:'GOOG', country:'United States' };
    it('getprice', function(done) {
        (new quotes.morningstar(httpsProxy)).getprice(security, () => done(), function(security,err) { done(err) });
    });

    it('gethistory should return with error', function(done) {
        (new quotes.morningstar(httpsProxy)).gethistory(security, () => done('Should not be here'), function(security,err) { done() });
    });
});
