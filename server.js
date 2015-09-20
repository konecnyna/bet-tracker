var express = require('express');
var football = require('./football.js');
var app = express();

app.use(express.static(__dirname + '/public'));


app.get('/api/v1/nfl', function(req, res) {    
 football.getScores(function(callback){
      res.json(callback);
   });
});


app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.listen(8080);

