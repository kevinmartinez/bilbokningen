var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('cancel.pug', {
        pageTitle: 'Bilbokningen | Cancel booking'
    });
});

module.exports = router;