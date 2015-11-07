var express = require('express');
var games = require('./games.js');
var predictions = require('./predictions.js');
var streams = require('./streams.js');
var rss = require('./football_rss.js');


var app = express();
var fs = require('fs');
var path = require('path');
var PICKS_FILE_NAME = "picks.json";
var jsonfile = require('jsonfile');
var serverPort = 9000;

app.use(express.static(__dirname + '/public'));


app.get('/api/v1/scores', function(req, res) {    
 	games.getUIData(function(callback){
      res.json(callback);
   	});
});

app.get('/api/v1/picks', function(req, res) {
	var prettyJson = JSON.stringify(jsonfile.readFileSync(PICKS_FILE_NAME), null, 4);
	res.json(prettyJson);	
});

app.get('/api/v1/streams', function(req, res) {
	streams.getStreams(function(callback){
		res.json(callback);
	}, req.query.type);
});
app.get('/streams', function(req, res) {
	res.redirect('/streams.html');
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


app.get('/api/v1/rss', function(req, res) {
	rss.getFootballRss( function(xml){
		res.set('Content-Type', 'text/xml');
		res.send(xml);	
	});

});



app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.listen(serverPort);

