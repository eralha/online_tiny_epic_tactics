var express = require('express');
var port = process.env.PORT || 3000;
var app = express();
var server = require('http');
var path = require('path');

app.server = server.createServer(app);

var com = require('./socket')(app.server);
global.com = com;

//Use body parser
var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(express.json());

//Set middleware for app logic
app.use(require('./controllers'));

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(express.static('public'));

app.server.listen(port, function () {
  console.log('Example app listening on port '+port);
});

