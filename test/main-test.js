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
