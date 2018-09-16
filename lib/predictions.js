var utils = require("./utils.js");
var util = require("util");
var async = require("async");
var fs = require("fs");
var path = require("path");
var positions = ["QB", "RB", "WR", "K", "TE"]; //, "TE"
var base_url =
  "http://www.fantasyfootballnerd.com/service/weekly-projections/json/test/%s/4/";
var schedule_url = "http://www.fantasyfootballnerd.com/service/schedule/json//";
var DEBUG = false;
//var FFNerd = require('fantasy-football-nerd');
//var ff = new FFNerd({ api_key: "6eb6ua9srbfm"});

var positions = ["QB", "RB", "WR", "TE", "K", "DEF"];

module.exports = {
  getScores: function(callback) {
    getPreditions(callback);
  }
};

week = 1;
function getPreditions(callback) {
  callback({});
  // teams_map = {};
  // async.eachSeries(positions, function iterator(item, callback) {
  // 	ff.weeklyProjections( function(item, week, projections) {

  //   		if(!projections || !projections.Projections) {
  //   			callback();
  //   			return;
  //   		}

  // 		var players = projections.Projections;
  // 		players.map(player => {
  // 			if (!teams_map[player.team]) {
  // 				teams_map[player.team] = {};
  // 				teams_map[player.team].score = 0;
  // 				teams_map[player.team].defPA = 0;
  // 				teams_map[player.team].predictions = [];
  // 			}

  // 			//teams_map[player.team].predictions.push(player);

  // 			var score = player.passTD * 6;
  // 			score += player.rushTD * 6;
  // 			score += player.recTD * 6;
  // 			score += Number.parseInt(player.xp);
  // 			score += player.fg * 3;
  // 			score += player.defTD * 6;

  // 			if (player.position === "DEF") {
  // 				teams_map[player.team].defPA = player.defPA*1;
  // 			}

  // 			teams_map[player.team].score += score;
  // 		});
  // 		callback();

  // 	});

  // }, function done() {
  // 	ff.schedule(function(schedule){
  // 		var num_correct = 0;
  // 		week_results = schedule.Schedule.filter(game =>{
  // 			return game.gameWeek == week;
  // 		}).map(game =>{
  // 			game.awayScore = (Math.round(teams_map[game.awayTeam].score * 100) / 100);
  // 			game.homeScore = (Math.round(teams_map[game.homeTeam].score * 100) / 100);
  // 			homedef = teams_map[game.homeTeam].defPA;
  // 			awaydef = teams_map[game.awayTeam].defPA;
  // 			game.awaydef =awaydef;
  // 			game.homedef =homedef;
  // 			game.predicted_winner = game.awayScore-homedef > game.homeScore-awaydef ? game.awayTeam : game.homeTeam;

  // 			if(game.predicted_winner == game.winner){ num_correct++;}
  // 			return game;
  // 		});
  //     	//saveSchedule(schedule);
  //     	console.log(num_correct);
  // 	    callback(week_results);
  // 	});
  //   	// callback(teams_map);
  // });
}

function saveSchedule(schedule) {
  var jsonfile = require("jsonfile");
  var path = require("path");
  var fs = require("fs");
  var file = path.join(
    __dirname,
    "schedule_w" + schedule.currentWeek + ".json"
  );
  console.log("making file!");
  jsonfile.writeFile(file, schedule, function(err) {
    console.error(err);
  });
}
