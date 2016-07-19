var express = require('express');
var server = require('./lib/server.js');

var app = module.exports = express();
var betTracker = new server(app);

app.listen(9000);



