var express = require('express')
, router = express.Router();


router.use('/chat', require('./chat'));

router.use('/game', require('./game'));

module.exports = router;