var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index.pug', {
        pageTitle: 'Välkommen till Bilbokningen'
    });
});

module.exports = router;