var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var url = 'mongodb://grupp10:123123@ds133981.mlab.com:33981/bilbokning';

var index = require('./routes/index');
var login = require('./routes/login');
var signup = require('./routes/signup');
var logout = require('./routes/logout');
var cancel = require('./routes/cancel');
var manageCars = require('./routes/manage-cars');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "Your secret key",
    resave: true,
    saveUninitialized: false
}));
app.use(cookieParser());

// app.use('/logout', logout);
app.use('/login', login);
app.use('/signup', signup);


mongoose.connect(url);
mongoose.connection.on('error', (error) => {
    console.log(error);
});
mongoose.Promise = global.Promise;

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
    // console.log(req.body, 24);
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

// Logout user 

app.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.render('logout');
});

// car settings

app.get('/', (req, res) => {
    // console.log('we on index');
    car.find({}, (error, results) => {
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

// check if date is booked 
app.post('/bookings/:id', (req, res) => {
    console.log('checking date');
    car.findById(req.params.id, function(error, result) {
        if (error) {
            res.send(error);
        } else {
            var bookingsInRange = result.booking.filter(function(elem) { return checkDates(req.body.startDate, req.body.endDate, elem) });
            if (bookingsInRange.length > 0) {
                res.send('true');
            } else {
                res.send('false');
                console.log('free dates');
            }
        }
    });
});


// Check if dates are already booked for this car
function checkDates(startDate, endDate, booking) {
    var sDate = new Date(startDate);
    var eDate = new Date(endDate);

    var csDate = new Date(booking.startDate);
    var ceDate = new Date(booking.endDate);

    if (sDate <= ceDate && sDate >= csDate ||
        eDate <= ceDate && eDate >= csDate) {
        return true;
    }
}

// update booking of car 
// TODO : add not signed in users to book


app.patch('/:id', (req, res) => {
    console.log('in booking car');
    if (req.session.user !== undefined) {
        car.findByIdAndUpdate(req.params.id, { $push: { booking: { endDate: req.body.endDate, startDate: req.body.startDate, email: req.session.user } } }, { new: true }, (error, results) => {
            if (error) res.send(error);
            console.log('Successfully booked a car');
        });
    } else {
        car.findByIdAndUpdate(req.params.id, { $push: { booking: { endDate: req.body.endDate, startDate: req.body.startDate, email: req.body.email } } }, { new: true }, (error, results) => {
            if (error) res.send(error);
            console.log('Successfully booked a car for non signed in user');
        });
    }
});

// get bookings from logged in user
app.get('/cancel', (req, res) => {
    console.log(req.session.user);
    if (req.session.user !== undefined) {
        car.aggregate({ $match: { 'booking.email': req.session.user }, },
            function(error, results) {
                if (error) {
                    res.send(error);
                } else {
                    console.log(results, 22);
                    results = results.map(function(result) { return trim(req.session.user, result) });
                    console.log(results, 45);
                    res.render('cancel', {
                        title: 'cars',
                        results: results,
                        id: req.session.user
                    })
                }
            }
        );
    } else {
        res.render('cancel', { id: req.session.user });
    }
});

// get bookings from not logged in user
app.post('/cancel', (req, res) => {
    car.aggregate({ $match: { 'booking.email': req.body.email } },
        function(error, results) {
            if (error) {
                res.send(error);
            } else {
                results = results.map(function(result) { return trim(req.body.email, result) });
                res.render('cancel', {
                    title: 'cars',
                    results: results,
                    id: req.session.user
                })
            }
        }
    );
})

// remove bookings for other users when same car
function trim(email, car) {
    console.log(car.booking);
    console.log(email);
    for (i in car.booking) {
        if (car.booking[i].email != email) {
            car.booking.splice(i, 1);
        }
    }
    return car;
}


// remove bookings
app.patch('/cancel/:id', (req, res) => {
    console.log(req.params.id);
    car.findOneAndUpdate({ 'booking._id': req.params.id }, { $pull: { 'booking': { _id: req.params.id } } }, { new: true }, (error, results) => {
        if (error) res.send(error);
        console.log(results);
        console.log('Successfully canceled booked car');
    });
});


// END of Database setup and commands


module.exports = app;