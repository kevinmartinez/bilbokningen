var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('manage-cars.pug', {
        pageTitle: 'Lägg till och ta bort bilar'
    });
});

module.exports = router;