var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var fs = require('fs');
var path = require('path');
var positions = ["QB", "RB", "WR", "K", "TE"]; //, "TE"
var base_url = "http://www.fantasyfootballnerd.com/service/weekly-projections/json/test/%s/4/";
var schedule_url = "http://www.fantasyfootballnerd.com/service/schedule/json//";
var DEBUG = false;
var FFNerd = require('fantasy-football-nerd');
var ff = new FFNerd({ api_key: "test"}); //ejwqdwezs7xi
 

var positions = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

module.exports = {
  getScores: function (callback) {
  	getPreditions(callback);
  }
};


function getPreditions(callback){
	week = 1;
	teams_map = {};	
	async.eachSeries(positions, function iterator(item, callback) {
		ff.weeklyProjections(item, week, projections => {
	  		console.log(projections);
	  		if(!projections || !projections.Projections) {
	  			callback();
	  			return;
	  		}
	  		//console.log(item, projections.Projections.length);
			var players = projections.Projections;			
			players.map(player => {
				if (!teams_map[player.team]) {
					teams_map[player.team] = {};
					teams_map[player.team].score = 0;
					teams_map[player.team].predictions = [];					
				}

				//teams_map[player.team].predictions.push(player);			
				
				var score = player.passTD * 6;
				score += player.rushTD * 6;	
				score += Number.parseInt(player.xp);
				score += player.fg * 3;			

				teams_map[player.team].score += score;
			});
			callback();
						
		});

	}, function done() {
		// ff.schedule(function(schedule){
		// 	scedule = schedule.Schedule.map(game =>{
		// 		console.log(game);
		// 		game.awayScore = teams_map[game.awayTeam].score;
		// 		game.homeScore = teams_map[game.homeTeam].score;
		// 	});
	 //    	//saveSchedule(schedule);
		//     callback(schedule);
		// }); 
	  	callback(teams_map);
	});
	
	
}


function saveSchedule(schedule) {
	var jsonfile = require('jsonfile')
	var path = require('path');
	var fs = require('fs');
	var file = path.join(__dirname, "schedule_w"+schedule.currentWeek+".json");
    console.log("making file!");
    jsonfile.writeFile(file, schedule, function (err) {
	  console.error(err)
	});

}