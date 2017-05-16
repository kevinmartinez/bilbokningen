var chai = require('chai');
var expect = chai.expect;

// This is a test suite, a block of unit tests that belong together
// First argument describe what we test, second just wrapper callback
describe('Mocha', function () {
    // Simple 'sanity' check
    it('Mocha should run with \'npm test\'', function () {
        expect(true).to.be.ok;
    });
});

// Old test, saved as example
// // Test carSort
// describe('Sort a Car depending on properties', function () {
//     it('Log out a car', function () {
//         expect(carSort()).to.be.a('string');
//         expect(bmw).to.be.a('string');
//     });
//     it('Is bmw a string?', function () {
//         expect(bmw.model).to.equal('bmw');
//     });
// });