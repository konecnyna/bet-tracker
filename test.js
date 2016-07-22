
var BetTracker = require('./index.js');
var express = require('express');
var app = express();


new BetTracker(app); 
app.listen(3000);