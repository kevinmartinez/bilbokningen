var http = require('http');
var app = require('./server');
var port = normalizePort(process.env.PORT || '3030'); //run on localhost:3030

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

var server = http.createServer(app);
server.listen(port);