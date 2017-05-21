var chai = require('chai');
var expect = chai.expect;
var mongoose = require("mongoose");
let chaiHttp = require('chai-http');
// var request = require('request');
var app = require('../server.js');
var user = require('../models/User.js');
var car = require('../models/Car.js');
let should = chai.should();
chai.use(chaiHttp);

describe('firstpage test', function() {
    // Simple '/' check
    it('should return 200', function() {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
            });
    });
});

// bilar

describe('/POST cars', function() {
    it('should POST a car', function() {
        var car = {
            model: "Tesla",
            seats: 2,
            isAuto: true,
            hasRoofrack: false,
            price: 500
        }
        chai.request(app)
            .post('/manage-cars')
            .send(car)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.car.should.have.property('model');
                res.body.car.should.have.property('seats');
                res.body.car.should.have.property('isAuto');
                res.body.car.should.have.property('hasRoofrack');
                res.body.car.should.have.property('price');
                res.body.should.have.property('message').eql('New car added to database');
            });
    });

    it('it should not POST a car', function() {
        var car = {
            isAuto: true,
            hasRoofrack: false,
            price: 500
        }
        chai.request(app)
            .post('/manage-cars')
            .send(car)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('errors');
                res.body.errors.model.should.have.property('kind').eql('required');
                res.body.errors.seats.should.have.property('kind').eql('required');
            });
    });
});


describe('/DELETE/:id car', function() {
    it('it should DELETE a car given the id', function() {
        var newCar = new car({
            model: "Tesla",
            seats: 2,
            isAuto: true,
            hasRoofrack: false,
            price: 500
        })
        newCar.save((err, car) => {
            chai.request(app)
                .delete('/manage-cars/' + car.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Car Removed Successfully');

                });
        });
    });
});




// users

describe('/POST users', function() {
    // Simple '/' check
    it('should create a new account', function() {
        var user = {
            email: 'me@email.com',
            password: 'lalala'
        }
        chai.request(app)
            .post('/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('password');
                res.body.should.have.property('message').eql('New user added to database');
            });
    });

    it('should not create a new account', function() {
        var user = {
            email: 'me@email.com',
        }
        chai.request(app)
            .post('/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('errors');
                res.body.errors.password.should.have.property('kind').eql('required');
            });
    });

    it('should verify login of account', function() {
        chai.request(app)
            .post('/login')
            .send({ email: 'me@email.com', password: 'lalala' })
            .end((err, res) => {
                res.should.have.status(200);
                email.should.equal('me@email.com');
                password.should.equal('lalala');
                res.body.should.have.property('message').eql('user exsist in database');
            });
    });

    it('should not verify login of account', function() {
        chai.request(app)
            .post('/login')
            .send({ password: 'lalala' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('errors');
                res.body.errors.email.should.have.property('kind').eql('required');
                password.should.equal('lalala');
            });
    });
});