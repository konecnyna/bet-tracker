var SportStreams = require("./index.js");
var express = require("express");
var app = express();

new SportStreams(app);
app.listen(3000);
