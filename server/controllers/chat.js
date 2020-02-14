var express = require('express')
, router = express.Router();

var querys = require('../querys');
var config = require('../config');


router.get('/groups/:userid', function(req, res, next) {

    res.json({ status: 1 });

});


router.post('/save-pre-keys', function(req, res, next) {
    
    res.json({ status: 1 });

});


module.exports = router;