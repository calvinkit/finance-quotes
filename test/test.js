var httpProxyAgent = require('http-proxy-agent');
var httpsProxyAgent = require('https-proxy-agent');
var util = require('util');
var httpsProxy = process.env.HTTP_PROXY?new httpsProxyAgent(process.env.HTTP_PROXY):null;
var httpProxy = process.env.HTTP_PROXY?new httpProxyAgent(process.env.HTTP_PROXY):null;
var avkey = '';
var qlkey = '';

var quotes = require('./../lib/index');

var q = new quotes.cnbc(httpsProxy, qlkey);
var security = { ticker:'GOOG',yticker:'GOOG', country:'United States' };
q.getprice(security, console.log, console.log)

var q = new quotes.quandl(httpsProxy, qlkey);
var security = { ticker:'043602_F_ALL',yticker:'043602_F_ALL', country:'CFTC' };
q.getprice(security, console.log, console.log)
