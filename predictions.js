var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var positions = ["QB", "RB", "WR", "K"]; //, "TE"
var base_url = "http://www.fantasyfootballnerd.com/service/weekly-projections/json/test/%s/3/"
module.exports = {
  getScores: function (callback) {
  	getScores(callback);
  }
};



function getScores(callback){
	var gameScores = {};

	async.eachSeries(positions, function iterator(item, callback) {
	  	
	  	utils.downloadFile(util.format(base_url, item), function(data){
			var games = JSON.parse(data);
			generateScores(games.Projections, gameScores);
			callback();
		});

	}, function done() {
		callback(gameScores);
	  
	});
	
}

function generateScores(games, gamesScores){
	for(var i=0; i<games.length; i++){
		score = 0;
		score += parseInt(games[i].rushTD) * 7;
		score += parseInt(games[i].passTD) * 7;
		score += parseInt(games[i].rushYds) / 10;
		score += parseInt(games[i].passYds) / 100;

		if(games[i].recYds){
			score += parseInt(games[i].recYds) / 10;
			score += parseInt(games[i].recTD) * 7;
		}

		if(games[i].fg){
			score += games[i].fg * 3;
		}
			
		
		if(gamesScores[games[i].team]){
			gamesScores[games[i].team] = score + gamesScores[games[i].team];					
		}else{
			gamesScores[games[i].team] = score;						
		}

	}
}