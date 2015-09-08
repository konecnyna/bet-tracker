var express = require('express');
var football = require('./football.js');
var app = express();

app.get('/api/v1/nfl', function(req, res) {    
 football.getScores(function(callback){
      res.json(callback);
   });
});



app.use(express.static(__dirname + '/html'));
app.listen(8080);

