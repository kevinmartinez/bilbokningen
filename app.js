var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var url = 'mongodb://grupp10:123123@ds133981.mlab.com:33981/bilbokning';

var index = require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
var manageCars = require('./routes/manage-cars');

var app = express();

// if using pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "Your secret key" }));
app.use(cookieParser());

// app.use('/', index);
// app.use('logout', logout);
app.use('/login', login);
app.use('/signup', signup);
// app.use('/manage-cars', manageCars);
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

app.post('/signup', (req, res) => { // on sign up - check if username already exsists 
    user.find({ email: req.body.email }, function(error, exsist) {
        if (exsist.length) {
            console.log('user already exsist');
        } else {
            var newUser = new user(req.body);
            newUser.save((error, results) => {
                if (error) { res.send(error); } else {
                    console.log('New user added to database');
                    req.session.user = req.body.email;
                    console.log(req.session.user, 55);
                    res.redirect('/');
                }
            });
        }
    });
});

app.post('/login', (req, res) => { // on log in - check if username and password is correct 
    console.log(req.body, 24);
    user.find({ email: req.body.email, password: req.body.password }, function(error, exsist) {
        if (exsist.length) { // if username and password match 
            console.log(exsist, 32);
            console.log('user exsist in database')
            req.session.user = req.body.email;
            console.log(req.session.user, 55)
            res.redirect('/');
        } else {
            console.log('Wrong username or password');
        }
    });
});

app.get('/logout', function(req, res) {
    console.log('we here')
    if (error) {
        res.send(error);
    } else {
        // req.session.destroy();
        // res.redirect('/');
        res.render('logout', { title: loggedout })
    }
});

// car settings

app.get('/', (req, res) => {
    console.log('we on index');
    car.find({ booking: [] }, (error, results) => {
        if (error) {
            res.send(error);
        } else {
            console.log(req.session.user)
            res.render('index', {
                title: 'cars',
                results: results,
                id: req.session.user
            })
            console.log('Fetched all cars for index');
        }
    });
});

var car = require('./models/Car.js');

app.get('/manage-cars', (req, res) => { // get all cars 
    car.find({}, (error, results) => {
        if (error) {
            res.send(error);
        } else {
            res.render('manage-cars', {
                title: 'cars',
                results: results,
                id: req.session.user
            })
            console.log('Fetched all cars for manage-cars');
        }
    });
});

// prints "The author is Bob Smith"

app.post('/manage-cars', (req, res) => { // add new car
    var newCar = new car(req.body);
    newCar.save((error, results) => {
        if (error) {
            res.send(error);
        } else {
            // res.send('success');
            console.log('New car added to database');
        }
    });
});

app.delete('/manage-cars/:id', (req, res) => { // delete car 
    car.findByIdAndRemove({ _id: req.params.id }, (error, results) => {
        if (error) res.send(error);
        console.log('Car Removed Successfully');
    });
});

// update car with booking (can be post)
// client need to supply id of car -> post method to url /cars/id(of car to be booked)
app.patch('/cars/:id', (req, res) => {
    car.findByIdAndUpdate(req.params.id, { $push: { booking: { endDate: req.body.endDate, startDate: req.body.startDate, email: req.body.email, name: req.body.name } } }, { new: true }, (error, results) => {
        if (error) res.send(error);
        // res.send(results);
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