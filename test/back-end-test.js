var chai = require('chai');
var expect = chai.expect;
var mongoose = require("mongoose");
let chaiHttp = require('chai-http');
var app = require('../server.js');
var user = require('../models/User.js');
var car = require('../models/Car.js');
let should = chai.should();
chai.use(chaiHttp);

describe('firstpage test', function() {
    // Simple '/' index page check
    it('should return 200', function() {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
            });
    });
});

describe('car', () => {
    beforeEach((done) => { //Before each test we empty the database
        car.remove({}, (err) => {
            done();
        });
    });

    // bilar
    describe('/POST car', function() {
        it('should POST a car', (done) => {
            chai.request(app)
                .post('/manage-cars')
                .send({
                    'model': "Tesla",
                    'seats': 2,
                    'isAuto': true,
                    'hasRoofrack': false,
                    'price': 500
                })
            expect(200);
            done();
        });

        it('it should not POST a car', (done) => {
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
                    done();
                });
        });
    });


    describe('/DELETE/:id car', function() {
        it('it should DELETE a car given the id', (done) => {
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
                    .send(car)
                expect(200);
                done();
            });
        });
    });

    describe('/GET bookings', function() {
        it('it should POST cars that user has booked', (done) => {
            chai.request(app)
                .post('/cancel')
                .send({ 'booking.email': 'mikaelatornlund@hotmail.se' })
            expect(200);
            done();
        });
    });
});
// users

describe('user', () => {
    beforeEach((done) => {
        user.remove({}, (err) => {
            done();
        });
    });

    describe('/POST user', function() {
        it('should create a new account', (done) => {
            chai.request(app)
                .post('/signup')
                .send({ email: 'me@email.com', password: 'lalala' })
            expect('Location', '/\/$/');
            done();
        });

        it('should not create a new account', (done) => {
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
                    done();
                });
        });

        it('should not verify login of account', (done) => {
            chai.request(app)
                .post('/login')
                .send({ 'email': 'me@email.com' })
            expect(200, 'false')
            done();
        });

        it('should verify login of account', (done) => {
            chai.request(app)
                .post('/login')
                .send({ email: 'me@email.com', password: 'lalala' })
            expect('Location', '/\/$/');
            done();

        });


    });

});