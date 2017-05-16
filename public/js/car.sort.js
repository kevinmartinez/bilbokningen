'use strict';
var Car = require('../../models/Car');

var bmw = new Car({
    model: 'bmw'
});

var heading = document.getElementsByTagName('h3')[0];
heading.textContent = bmw.model;

console.log(typeof bmw.model);

var carSort = function (car) {
    car = 1;
    return car;
};

module.exports.carSort = carSort;
module.exports.bmw = bmw;