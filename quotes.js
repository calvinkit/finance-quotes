var http = require('follow-redirects').http;
var parse = require('url-parse');

class Quotes {
    constructor(agent) {
        if (new.target == Quotes) throw new TypeError('Cannot construct abstract Quote class');
        this.agent = agent; 
    }

    getprice(security, onsuccess, onerror) {
        var url = parse(this.buildPriceURL(security), true);
        var options = { host: url.host,
                        headers: { Host: url.host },
                        agent: this.agent,
                        path: url.pathname };
        var data = "";

        http.get(options, (res) => {
            res.setEncoding();
            res.on('data', (chunk) => data += chunk);
            res.on('error', (err) => { onerror(security, err) });
            res.on('end', () => {
                if (res.statusCode == 404) return onerror(security, 'statusCode==404');
                this.parsePriceData(security, data);
                onsuccess(security);
            });
        });
    }

    gethistory(security, intraday, onsuccess, onerror) {
        var url = parse(this.buildHistoryURL(security), true);
        var options = { host: url.host,
                        headers: { Host: url.host },
                        agent: this.agent,
                        path: url.pathname };

        http.get(options, (res) => {
            res.setEncoding();
            res.on('data', (chunk) => data += chunk);
            res.on('error', (err) => { onerror(security, err) });
            res.on('end', () => {
                if (res.statusCode == 404) return onerror(security, 'statusCode==404');
                this.parseHistoryData(security, data);
                onsuccess(security);
            });
        });
    }

    buildPriceURL(security) { return; }
    buildHistoryURL(security){ return; }
    parsePriceData(security, data) { return security; }
    parseHistoryData(security, data) { return security; }
}

module.exports = Quotes;
