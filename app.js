var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var engine = require('consolidate'); // If using HTML

var index = require('./routes/index');
var login = require('./routes/login');

var app = express();

// If using HTML 

// app.set('views', __dirname + '/views');
// app.engine('html', engine.mustache);
// app.set('view engine', 'html');

// if using pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', login);
var port = normalizePort(process.env.PORT || '3030');
app.set('port', port);


function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

var server = http.createServer(app);
server.listen(port);

// localhost:3030