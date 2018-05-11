var http = require('follow-redirects').https;
var parse = require('url-parse');

class Quotes {
    constructor(agent) {
        if (new.target == Quotes) throw new TypeError('Cannot construct abstract Quote class');
        this.agent = agent; 
    }

    getprice(security, onsuccess, onerror) {
        try {
            var url = parse(this.buildPriceURL(security), false);
            var options = { host: url.host,
                            headers: { Host: url.host },
                            agent: this.agent,
                            path: url.toString() };
            var data = "";
            http.get(options, (res) => {
                res.setEncoding();
                res.on('data', (chunk) => data += chunk);
                res.on('error', (err) => { onerror(security, err) });
                res.on('end', () => {
                    if (res.statusCode == 404) return onerror(security, 'statusCode==404');
                    if (data=="") return onerror(security, 'empty data');
                    this.parsePriceData(security, data);
                    onsuccess(security);
                });
            });
        } catch (err) {
            onerror(security, err);
        }
    }

    gethistory(security, onsuccess, onerror) {
        try {
            var url = parse(this.buildHistoryURL(security), false);
            var options = { host: url.host,
                            headers: { Host: url.host },
                            agent: this.agent,
                            path: url.toString() };
            var data = "";
            http.get(options, (res) => {
                res.setEncoding();
                res.on('data', (chunk) => data += chunk);
                res.on('error', (err) => { onerror(security, err) });
                res.on('end', () => {
                    if (res.statusCode == 404) return onerror(security, 'statusCode==404');
                    if (data=="") return onerror(security, 'empty data');
                    this.parseHistoryData(security, data);
                    onsuccess(security);
                });
            });
        } catch (err) {
            onerror(security, err);
        }
    }

    buildPriceURL(security) { throw new Error("Not supported") }
    buildHistoryURL(security){ throw new Error("Not supported") }
    parsePriceData(security, data) { return security; }
    parseHistoryData(security, data) { return security; }
}

var moment = require('moment');
Date.prototype.toString = function() {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var d = this.getDate()<10?"0"+this.getDate():this.getDate();
    var m = this.getMonth();
    var y = this.getFullYear();
    return d+"-"+months[m]+"-"+y;
};

Date.prototype.toTimestamp = function() {
    var year = this.getFullYear();
    var month = this.getMonth()+1;
    var date = this.getDate();
    return year+'-'+(month<10?"0":"")+month+"-"+(date<10?"0":"")+date;
};


Date.prototype.toTimeString = function() {
    var s = this.getSeconds()<10?"0"+this.getSeconds():this.getSeconds();
    var m = this.getMinutes(); m = m<10?"0"+m:m;
    var h = this.getHours(); h = h<10?"0"+h:h;
    return h+":"+m+":"+s;
};

Date.prototype.toGMTDate = function() {
    var b = this.getTimezoneOffset()*60000;
    return new Date(this.getTime()-b);
};

Date.prototype.fromGMTDate = function() {
    var b = this.getTimezoneOffset()*60000;
    return new Date(this.getTime()+b);
};

Date.prototype.parseInput = function(str) {
    return (str&&str!=""?new Date(str.replace("-","/")).toGMTDate():null);
};

Date.prototype.addBusinessDate = function(d) {
    var wks = d>0?Math.floor(d/5):Math.ceil(d/5);
    var dys = d%5
    var dy = this.getDay();
    if (dy === 6 && dys > -1) {
        if (dys === 0) {dys-=2; dy+=2;}
        dys++; dy -= 6;
    }
    if (dy === 0 && dys < 1) {
        if (dys === 0) {dys+=2; dy-=2;}
        dys--; dy += 6;
    }
    if (dy + dys > 5) dys += 2;
    if (dy + dys < 1) dys -= 2;
    this.setDate(this.getDate()+wks*7+dys);
    return this;
};

Date.prototype.toExcelDate = function() {
    return parseInt(this.getTime()/(1000*60*60*24)+25569);
};

Date.prototype.fromExcelDate = function(excel) {
    return new Date((excel-25569.0)*3600000*24);
};

Date.prototype.add = function(val, type) {
    return moment(this).add(val, type).toDate();

};

module.exports = Quotes;
