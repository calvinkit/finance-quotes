var httpProxyAgent = require('http-proxy-agent');
var httpsProxyAgent = require('https-proxy-agent');
var util = require('util');
var httpsProxy = process.env.HTTP_PROXY?new httpsProxyAgent(process.env.HTTP_PROXY):null;
var httpProxy = process.env.HTTP_PROXY?new httpProxyAgent(process.env.HTTP_PROXY):null;


var AlphaVantage = require('./alphavantage');
var q = new AlphaVantage(httpProxy);
var security = { ticker:'GOOG',yticker:'GOOG' };
q.getprice(security, console.log, console.log)

