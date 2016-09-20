
var BetTracker = require('./index.js');
var express = require('express');
var app = express();


new BetTracker(app);
console.log("listening on http://localhost:3000/bet-tracker");
app.listen(3000);