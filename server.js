var express = require('express');
var football = require('./football.js');
var games = require('./games.js');
var predictions = require('./predictions.js');
var app = express();
var fs = require('fs');
var path = require('path');
var PICKS_FILE_NAME = "picks.json";
var jsonfile = require('jsonfile');
app.use(express.static(__dirname + '/public'));


app.get('/api/v1/scores', function(req, res) {    
 	games.getUIData(function(callback){
      res.json(callback);
   	});
});

app.get('/api/v1/picks', function(req, res) {
	res.json(jsonfile.readFileSync(PICKS_FILE_NAME));	
});

app.get('/api/v1/predictions', function(req, res) {
 predictions.getScores(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/update_picks', function(req, res) {

	try{
		messageObject = JSON.parse(req.query.picks);
		jsonfile.writeFile(PICKS_FILE_NAME, messageObject, function (err) {
			if(err){
				console.error("error: " + err);
				res.send("got error");	
			}else{
				res.send("good");	
			}				
		});

	}catch(e){		
		console.log("Bad json: " + e);
		res.send("fail!");
	}
});



app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.listen(8080);

