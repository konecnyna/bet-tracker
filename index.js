var express = require('express');
var path = require('path');
var games = require('./lib/games.js');
var predictions = require('./lib/predictions.js');
var rss = require('./lib/football_rss.js');

var fs = require('fs');
var path = require('path');
var PICKS_FILE_NAME = path.join(__dirname, "/lib/picks.json");
var jsonfile = require('jsonfile');
var ROOT_NAME = "/bet-tracker";
	
var method = BetTracker.prototype;
function BetTracker(app) {	
	console.log("Running as default route:" , ROOT_NAME);


	app.use(ROOT_NAME, express.static(path.join(__dirname, 'lib/public')));	
	
	
	app.get(ROOT_NAME + '/api/v1/scores', function(req, res) {    
	 	games.getUIData(function(callback){
	      res.json(callback);
	   	});
	});

	app.get(ROOT_NAME + '/api/v1/picks', function(req, res) {
		var prettyJson = JSON.stringify(jsonfile.readFileSync(PICKS_FILE_NAME), null, 4);
		res.json(prettyJson);	
	});


	app.get(ROOT_NAME + '/api/v1/predictions', function(req, res) {
	 predictions.getScores(function(callback){
	      res.json(callback);
	   });
	});

	app.get(ROOT_NAME + '/api/v1/update_picks', function(req, res) {
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


	app.get(ROOT_NAME + '/api/v1/rss', function(req, res) {
		rss.getFootballRss( function(xml){
			res.set('Content-Type', 'text/xml');
			res.send(xml);	
		});

	});

}


module.exports = BetTracker;



