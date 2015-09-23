var express = require('express');
var football = require('./football.js');
var predictions = require('./predictions.js');
var app = express();
var fs = require('fs');
var path = require('path');
var PICKS_FILE_NAME = "picks.json";
app.use(express.static(__dirname + '/public'));


app.get('/api/v1/nfl', function(req, res) {    
 football.getScores(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/get_picks', function(req, res) {
 football.getPicks(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/predictions', function(req, res) {
 predictions.getScores(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/update_picks', function(req, res) {
	console.log(req.query.picks);
	if(JSON.parse(req.query.picks)){
		fs.writeFile(PICKS_FILE_NAME, JSON.stringify(req.query.picks), function (err) {
		  if (err) return console.log(err);

	  	  res.send('Success!');
		  console.log('wrote picks to disk');
		});
	}else{
		res.send("fail!");
	}

});

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.listen(8080);

