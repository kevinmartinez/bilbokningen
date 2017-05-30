var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var url = 'mongodb://grupp10:123123@ds133981.mlab.com:33981/bilbokning'; //database url at mlab

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
app.use(session({ //session to save user that's logged in
    secret: "Your secret key",
    resave: true,
    saveUninitialized: false
}));
app.use(cookieParser());

app.use('/login', login);
app.use('/signup', signup);


mongoose.connect(url); //setting up database
mongoose.connection.on('error', (error) => {
    console.log(error);
});
mongoose.Promise = global.Promise;

var user = require('./models/User.js'); //user schema

// sign up request 
app.post('/signup', (req, res) => {
    user.find({ email: req.body.email }, function(error, exsist) { //check if username already exsists 
        if (exsist.length) {
            console.log('user already exsist');
        } else {
            var newUser = new user(req.body);
            newUser.save((error, results) => { //save new user if username is free
                if (error) { res.send(error); } else {
                    console.log('New user added to database');
                    req.session.user = req.body.email; // log in the user
                    res.redirect('/');
                }
            });
        }
    });
});

// log in request 
app.post('/login', (req, res) => {
    user.find({ email: req.body.email, password: req.body.password }, function(error, exsist) { //check if username and password is correct
        if (exsist.length) { // if username and password match 
            console.log('user exsist in database')
            req.session.user = req.body.email; // log in the user
            res.redirect('/');
        } else {
            console.log('Wrong username or password');
        }
    });
});

// Logout user 
app.get('/logout', (req, res) => {
    req.session.user = undefined; //remove username from session
    res.render('logout');
});

// car settings
var car = require('./models/Car.js');

//get all cars for index page
app.get('/', (req, res) => {
    car.find({}, (error, results) => { //find all cars in db
        if (error) {
            res.send(error);
        } else {
            res.render('index', {
                title: 'cars',
                results: results,
                id: req.session.user //send the user in the session
            })
            console.log('Fetched all cars for index');
        }
    });
});


// get all cars for manage-cars
app.get('/manage-cars', (req, res) => {
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

// post request to add new car
app.post('/manage-cars', (req, res) => {
    var newCar = new car(req.body);
    newCar.save((error, results) => { //save car with form input 
        if (error) {
            res.send(error);
        } else {
            console.log('New car added to database');
        }
    });
});

// delete a car using the id 
app.delete('/manage-cars/:id', (req, res) => {
    car.findByIdAndRemove({ _id: req.params.id }, (error, results) => {
        if (error) res.send(error);
        console.log('Car Removed Successfully');
    });
});

// check if date is booked  - klar
app.post('/bookings/:id', (req, res) => {
    car.findById(req.params.id, function(error, result) { //find the car with the id to check its bookings
        if (error) {
            res.send(error);
        } else {
            var bookingsInRange = result.booking.filter(function(elem) { return checkDates(req.body.startDate, req.body.endDate, elem) }); // run filter function on each booking in the cars bookings
            if (bookingsInRange.length > 0) { //if there's overlapping booking
                res.send('true');
            } else {
                res.send('false'); //if the dates are free for that car
            }
        }
    });
});


// Check if dates are already booked for this car
function checkDates(startDate, endDate, booking) {
    var sDate = new Date(startDate); //startDate sent from client - make it into a date object
    var eDate = new Date(endDate);

    var csDate = new Date(booking.startDate); //startDate in the car's booking 
    var ceDate = new Date(booking.endDate);

    if (sDate <= ceDate && sDate >= csDate ||
        eDate <= ceDate && eDate >= csDate) { //check if the start or end date overlap with exsisting bookings 
        return true;
    }
}

// update with new booking for a car  - klar
app.patch('/:id', (req, res) => {
    if (req.session.user !== undefined) { // if a user is logged in
        car.findByIdAndUpdate(req.params.id, { $push: { booking: { endDate: req.body.endDate, startDate: req.body.startDate, email: req.session.user } } }, { new: true }, (error, results) => { //add a new booking to the car with the dates and user email from session
            if (error) res.send(error);
            console.log('Successfully booked a car');
        });
    } else { //if user is not logged in
        car.findByIdAndUpdate(req.params.id, { $push: { booking: { endDate: req.body.endDate, startDate: req.body.startDate, email: req.body.email } } }, { new: true }, (error, results) => { //add new booking and take email from input field
            if (error) res.send(error);
            console.log('Successfully booked a car for non signed in user');
        });
    }
});

// get bookings from logged in user
app.get('/cancel', (req, res) => {
    if (req.session.user !== undefined) { //if user is logged in
        car.aggregate({ $match: { 'booking.email': req.session.user }, }, //find cars where email in booking match the user in session
            function(error, results) {
                if (error) {
                    res.send(error);
                } else {
                    results = results.map(function(result) { return trim(req.session.user, result) }); //run map function to filter out bookings of other users for the same car
                    res.render('cancel', {
                        title: 'cars',
                        results: results,
                        id: req.session.user
                    })
                }
            }
        );
    } else {
        res.render('cancel', { id: req.session.user }); //if user not logged in
    }
});

// get bookings from not logged in user
app.post('/cancel', (req, res) => {
    car.aggregate({ $match: { 'booking.email': req.body.email } }, //find bookings with email from form input
        function(error, results) {
            if (error) {
                res.send(error);
            } else {
                results = results.map(function(result) { return trim(req.body.email, result) }); //run map function to filter out bookings of other users for the same car
                res.render('cancel', {
                    title: 'cars',
                    results: results,
                    id: req.session.user
                })
                console.log('got all bookings for user');
            }
        }
    );
})

// remove bookings for other users when booked the same car
function trim(email, car) {
    for (i in car.booking) { //loop through bookings of matched cars
        if (car.booking[i].email != email) {
            car.booking.splice(i, 1); // remove booking from the result
        }
    }
    return car;
}


// remove bookings
app.patch('/cancel/:id', (req, res) => {
    car.findOneAndUpdate({ 'booking._id': req.params.id }, { $pull: { 'booking': { _id: req.params.id } } }, { new: true }, (error, results) => { //remove booking with the given id
        if (error) res.send(error);
        console.log(results);
        console.log('Successfully canceled booked car');
    });
});


module.exports = app;