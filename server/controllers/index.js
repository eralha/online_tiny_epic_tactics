var express = require('express')
, router = express.Router();


router.use('/chat', require('./chat'));

module.exports = router;