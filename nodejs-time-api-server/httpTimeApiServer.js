const http = require('http');
const url = require('url');
const { padZero, getCurrentTimestampJson } = require('./timeTcpServer');

function parseTime(time) {
    return {
        hour: padZero(time.getHours()),
        minute: padZero(time.getMinutes()),
        second: padZero(time.getSeconds())
    };
}

function unixTime(time) {
    return { unixtime: time.getTime() };
}

const httpServer = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    let result;

    if (/^\/api\/parseTime/.test(req.url)) {
        const time = new Date(parsedUrl.query.iso);
        result = parseTime(time);
    } else if (/^\/api\/unixTime/.test(req.url)) {
        const time = new Date(parsedUrl.query.iso);
        result = unixTime(time);
    } else if (/^\/api\/currentTime/.test(req.url)) {
        result = getCurrentTimestampJson();
    }
    
    if (result) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(result));
    } else {
        res.writeHead(404);
        res.end();
    }
});

const httpPort = Number(process.argv[2]);

httpServer.listen(httpPort, () => {
    console.log(`HTTP JSON API Server is listening on port ${httpPort}`);
});