var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var url = 'mongodb://grupp10:123123@ds133981.mlab.com:33981/bilbokning';

var index = require('./routes/index');
var login = require('./routes/login');
var manageCars = require('./routes/manage-cars');

var app = express();

// if using pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', login);
app.use('/manage-cars', manageCars);
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

// Database setup and commands
// Maybe move this later

mongoose.connect(url);
mongoose.connection.on('error', (error) => {
    console.log(error);
});
mongoose.Promise = global.Promise;

// user settings 
var user = require('./models/User.js');

app.get('/users', (req, res) => { // get all users
    user.find({}, (error, results) => {
        res.json(results);
    });
});

app.post('/users', (req, res) => { // on sign up - check if username already exsists 
    // req.body.email;
    // req.body.password;
    user.find({ email: req.body.email }, function(error, exsist) {
        if (exsist.length) {
            console.log('user already exsist');
        } else {
            var newUser = new user(req.body);
            newUser.save((error, results) => {
                if (error) res.send(error);
                res.send(results);
                console.log('New user added to database');
            });
        }
    });
});

app.post('/findUser', (req, res) => { // on log in - check if username and password is correct 
    user.find({ email: req.body.email, password: req.body.password }, function(error, exsist) {
        if (exsist.length) { // if username and password match 
            console.log(exsist, 32);
        } else {
            console.log('Wrong username or password');
        }
    });
});

// car settings
var car = require('./models/Car.js');

app.get('/cars', (req, res) => { // get all cars 
    car.find({}, (error, results) => {
        res.json(results);
        console.log('Fetched all cars');
    });
});

app.post('/cars', (req, res) => { // add new car
    var newCar = new car(req.body);
    newCar.save((error, results) => {
        if (error) res.send(error);
        res.send(results);
        console.log('New car added to database');
    });
});

app.delete('/cars/:id', (req, res) => { // delete car need to send id of car to url /cars/:id
    car.findByIdAndRemove({ _id: req.params.id }, (error, results) => {
        if (error) res.send(error);
        console.log('Car Removed Successfully');
    });
});

// update car with booking (can be post)
// client need to supply id of car -> post method to url /cars/id(of car to be booked)
app.patch('/cars/:id', (req, res) => {
    car.findByIdAndUpdate(req.params.id, { $push: { booking: { endDate: req.body.endDate, startDate: req.body.startDate, email: req.body.email } } }, { new: true }, (error, results) => { // change req.body.id to the right car id later
        if (error) res.send(error);
        res.send(results);
        console.log('Successfully booked a car');
    });
});


// need one for unbook 
//  TODO: when user clicks to unbook : 
//  client need to send id of unbooked car 
//  - loop through user id (email) in cars booking to find his/her booking
// remove it from object  (this will be a function later)


// END of Database setup and commands

var server = http.createServer(app);
server.listen(port);

// localhost:3030