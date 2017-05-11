var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    // remove .html if using pug
    res.render('index.pug');
});

module.exports = router;