var express = require('express')
, router = express.Router();

var querys = require('../querys');
var config = require('../config');


router.get('/create-game', function(req, res, next) {

    res.json({ status: 1 });

});


router.post('/get-game', function(req, res, next) {
    
    res.json({ status: 1 });

});


module.exports = router;