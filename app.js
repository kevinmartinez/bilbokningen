var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var url = 'mongodb://grupp10:123123@ds133981.mlab.com:33981/bilbokning';

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
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
}

mongoose.connect(url);
mongoose.connection.on('error', (error) => {
    console.log(error);
});

var user = require('./models/User.js');
app.get('/users', (req, res) => {
    user.find({}, (error, results) => {
        res.json(results);
    })
})

app.post('/users', (req, res) => {

    // req.body.userName;
    // req.body.password;

    var usr = new user(req.body);

    usr.save((error, results) => {
        if (error) res.send(error);
        res.send(results);
    });
});

var server = http.createServer(app);
server.listen(port);

// localhost:3030