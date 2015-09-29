var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var positions = ["QB", "RB", "WR", "K", "TE"]; //, "TE"
var base_url = "http://www.fantasyfootballnerd.com/service/weekly-projections/json/test/%s/4/";
var schedule_url = "http://www.fantasyfootballnerd.com/service/schedule/json/ejwqdwezs7xi/";
var DEBUG = false;
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
		
	  	utils.downloadFile("http://www.fantasyfootballnerd.com/service/weekly-projections/json/ejwqdwezs7xi/def/3/", function(data){
			var games = JSON.parse(data);
			generateScores(games.Projections, gameScores);
			getScheduleAndApplyScores(callback, gameScores);
		});
	  	
	});
	
}

function getScheduleAndApplyScores(callback, gameScores){
  	utils.downloadFile(schedule_url, function(data){
		var games = JSON.parse(data);
		var currentWeek = DEBUG ? '2' : games.currentWeek;

		var currentWeekGames = [];
		for(var i=0; i<games.Schedule.length; i++){
			var currentGame = games.Schedule[i];
			if(currentGame.gameWeek === currentWeek){
				currentGame.awayTeamPredicition = gameScores[currentGame.awayTeam];
				currentGame.homeTeamPredicition = gameScores[currentGame.homeTeam] + 17;
				
				if(DEBUG){
					if(currentGame.winner === currentGame.awayTeam){
						currentGame.correct_predict = (currentGame.awayTeamPredicition - currentGame.homeTeamPredicition) > 0;
					}else{
						currentGame.correct_predict = (currentGame.homeTeamPredicition - currentGame.awayTeamPredicition) > 0;
					}
					
					if(!currentGame.correct_predict){
						currentWeekGames.push(currentGame);
					}

				}else{
					currentWeekGames.push(currentGame);	
				}			
			}
		}

		if(DEBUG){
			console.log("NUMBER WRONG: " + currentWeekGames.length + "/16");			
		}
		callback(currentWeekGames);
	});

}

function generateScores(games, gamesScores){
	for(var i=0; i<games.length; i++){
		score = 0;
		score += parseInt(games[i].rushTD) * 7;
		score += parseInt(games[i].passTD) * 7;
		//score += parseInt(games[i].rushYds) / 10;
		//score += parseInt(games[i].passYds) / 100;

		if(games[i].recYds){
			//score += parseInt(games[i].recYds) / 10;
			score += parseInt(games[i].recTD) * 7;
		}

		if(games[i].fg){
			score += games[i].fg * 3;
		}
		
		if(games[i].defTD){
			score += games[i].defTD * 7;
		}
		
		if(gamesScores[games[i].team]){
			gamesScores[games[i].team] = score + gamesScores[games[i].team];					
		}else{
			gamesScores[games[i].team] = score;						
		}

	}
}